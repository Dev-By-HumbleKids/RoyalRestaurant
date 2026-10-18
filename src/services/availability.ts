import { addDays, differenceInCalendarDays, format, parseISO, startOfDay } from 'date-fns';
import { tables } from '@/data/tables';
import type { DayAvailability, DiningArea, ReasonCode, RestaurantTable, SlotStatus, TableAvailability, TimeSlot } from '@/types';
import { RULES } from './rules';

/**
 * Deterministic availability engine. A seeded random number per (date, time, table) decides whether a
 * table is already "taken", weighted by weekday, time of night and how close the date is. The result looks
 * realistic and never changes between visits — then the visitor's own demo reservations are layered on top.
 */

export interface Occupancy {
  date: string;
  time: string;
  tableId: string;
}

// ——— seeded randomness ———
function hash(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function seeded(input: string): number {
  // mulberry32 step on the hash for a better distribution
  let t = (hash(input) + 0x6d2b79f5) >>> 0;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

// ——— calendar rules ———
export const toKey = (d: Date) => format(d, 'yyyy-MM-dd');

export function isPrivateEventDay(date: string): boolean {
  return seeded(`buyout|${date}`) < 0.035;
}

export function dayClosedReason(date: string, now = new Date()): ReasonCode | undefined {
  const day = parseISO(date);
  const diff = differenceInCalendarDays(day, startOfDay(now));
  if (diff < 0) return 'past';
  if (diff > RULES.maxDaysAhead) return 'tooFar';
  if ((RULES.closedWeekdays as readonly number[]).includes(day.getDay())) return 'monday';
  return undefined;
}

export function slotsForDate(date: string): { time: string; service: 'lunch' | 'dinner' }[] {
  const weekday = parseISO(date).getDay();
  const lunch = (RULES.lunchWeekdays as readonly number[]).includes(weekday)
    ? RULES.lunchSlots.map((time) => ({ time, service: 'lunch' as const }))
    : [];
  return [...lunch, ...RULES.dinnerSlots.map((time) => ({ time, service: 'dinner' as const }))];
}

function slotDate(date: string, time: string): Date {
  const [h, m] = time.split(':').map(Number);
  const d = parseISO(date);
  d.setHours(h, m, 0, 0);
  return d;
}

// ——— table occupancy ———
function occupancyProbability(date: string, time: string, table: RestaurantTable, now: Date): number {
  const day = parseISO(date);
  const weekdayBase = [0.46, 0, 0.28, 0.32, 0.4, 0.54, 0.62][day.getDay()];
  const [h, m] = time.split(':').map(Number);
  const minutes = h * 60 + m;
  let p = weekdayBase;
  if (h < 15) p -= 0.14; // lunch
  else if (minutes >= 19 * 60 && minutes <= 20 * 60 + 30) p += 0.18; // prime time
  else if (time === '18:00' || time === '22:30') p -= 0.16;
  const daysAhead = differenceInCalendarDays(day, startOfDay(now));
  p += 0.18 * Math.max(0, 1 - daysAhead / 21);
  if (daysAhead > 35) p -= 0.12;
  if (table.area === 'salon-noir' || table.area === 'cellar-room') p *= 0.65;
  if (table.area === 'chefs-counter') p *= 1.05;
  if (table.area === 'window') p += 0.08; // most requested seats
  return Math.min(0.95, Math.max(0.04, p));
}

export function isTableTaken(date: string, time: string, table: RestaurantTable, occupied: Occupancy[], now = new Date()): boolean {
  if (occupied.some((o) => o.date === date && o.time === time && o.tableId === table.id)) return true;
  return seeded(`${date}|${time}|${table.id}`) < occupancyProbability(date, time, table, now);
}

export function tableFits(table: RestaurantTable, partySize: number, service: 'lunch' | 'dinner'): boolean {
  if (table.area === 'chefs-counter' && service === 'lunch') return false;
  return partySize >= table.minSeats && partySize <= table.maxSeats;
}

function statusFromRatio(free: number, fitting: number): SlotStatus {
  if (fitting === 0 || free === 0) return 'full';
  return free / fitting > 0.5 ? 'available' : 'limited';
}

// ——— public queries ———
export function getDaySlots(date: string, partySize: number, occupied: Occupancy[], now = new Date(), area?: DiningArea): TimeSlot[] {
  const closed = dayClosedReason(date, now);
  const buyout = isPrivateEventDay(date);
  return slotsForDate(date).map(({ time, service }) => {
    const pool = tables.filter((t) => tableFits(t, partySize, service) && (!area || t.area === area));
    if (closed) return { time, service, status: 'closed', freeTables: 0, fittingTables: pool.length, reason: closed };
    if (buyout) return { time, service, status: 'full', freeTables: 0, fittingTables: pool.length, reason: 'buyout' };
    const cutoff = slotDate(date, time).getTime() - RULES.sameDayCutoffHours * 3600_000;
    if (now.getTime() > cutoff) {
      return { time, service, status: 'closed', freeTables: 0, fittingTables: pool.length, reason: 'cutoff' };
    }
    const free = pool.filter((t) => !isTableTaken(date, time, t, occupied, now)).length;
    return {
      time,
      service,
      status: statusFromRatio(free, pool.length),
      freeTables: free,
      fittingTables: pool.length,
      reason: pool.length === 0 ? 'noFit' : undefined,
    };
  });
}

export function getDayAvailability(date: string, partySize: number, occupied: Occupancy[], now = new Date()): DayAvailability {
  const closed = dayClosedReason(date, now);
  if (closed) return { date, status: 'closed', reason: closed };
  if (isPrivateEventDay(date)) return { date, status: 'full', reason: 'buyoutDay' };
  const slots = getDaySlots(date, partySize, occupied, now).filter((s) => s.status !== 'closed');
  if (slots.length === 0) return { date, status: 'closed', reason: 'closedToday' };
  const open = slots.filter((s) => s.status === 'available').length;
  if (open / slots.length >= 0.4) return { date, status: 'available' };
  if (slots.some((s) => s.status !== 'full')) return { date, status: 'limited' };
  return { date, status: 'full', reason: 'fullParty' };
}

export function getMonthAvailability(month: Date, partySize: number, occupied: Occupancy[], now = new Date()): DayAvailability[] {
  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  const days: DayAvailability[] = [];
  for (let d = first; d.getMonth() === first.getMonth(); d = addDays(d, 1)) {
    days.push(getDayAvailability(toKey(d), partySize, occupied, now));
  }
  return days;
}

export function getTables(date: string, time: string, partySize: number, occupied: Occupancy[], now = new Date()): TableAvailability[] {
  const service = slotsForDate(date).find((s) => s.time === time)?.service ?? 'dinner';
  return tables.map((table) => {
    if (!tableFits(table, partySize, service)) return { table, status: 'unsuitable' as const };
    return { table, status: isTableTaken(date, time, table, occupied, now) ? ('booked' as const) : ('free' as const) };
  });
}

export function areaStatus(list: TableAvailability[], area: DiningArea): SlotStatus {
  const fitting = list.filter((t) => t.table.area === area && t.status !== 'unsuitable');
  return statusFromRatio(fitting.filter((t) => t.status === 'free').length, fitting.length);
}

/** Smallest free table that fits, preferring the requested area. */
export function pickTable(list: TableAvailability[], area?: DiningArea): RestaurantTable | undefined {
  const free = list.filter((t) => t.status === 'free' && (!area || t.table.area === area));
  return free.sort((a, b) => a.table.maxSeats - b.table.maxSeats)[0]?.table;
}

export function nearestAlternatives(date: string, time: string, partySize: number, occupied: Occupancy[], now = new Date()): string[] {
  const slots = getDaySlots(date, partySize, occupied, now).filter((s) => s.status === 'available' || s.status === 'limited');
  const target = slotDate(date, time).getTime();
  return slots
    .filter((s) => s.time !== time)
    .sort((a, b) => Math.abs(slotDate(date, a.time).getTime() - target) - Math.abs(slotDate(date, b.time).getTime() - target))
    .slice(0, 3)
    .map((s) => s.time)
    .sort();
}
