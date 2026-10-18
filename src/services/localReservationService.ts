import { tableById } from '@/data/tables';
import { sleep } from '@/lib/utils';
import type { Reservation } from '@/types';
import {
  dayClosedReason,
  getDaySlots,
  getMonthAvailability,
  getTables,
  nearestAlternatives,
  pickTable,
  type Occupancy,
} from './availability';
import { generateReference } from './reference';
import {
  NetworkError,
  ReservationNotFoundError,
  SlotUnavailableError,
  type NewReservation,
  type ReservationService,
} from './reservationService';

const STORAGE_KEY = 'royal.reservations.v1';

/** Simulated conditions. Tweak in the console: `localStorage.setItem('royal.demo.conflictRate', '1')`. */
function demoRate(key: string, fallback: number): number {
  try {
    const raw = localStorage.getItem(`royal.demo.${key}`);
    return raw === null ? fallback : Number(raw);
  } catch {
    return fallback;
  }
}

function load(): Reservation[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Reservation[]) : [];
  } catch {
    return [];
  }
}

function save(list: Reservation[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    /* storage unavailable (private mode) — the demo still works for this page view */
  }
}

function occupancy(excludeReference?: string): Occupancy[] {
  return load()
    .filter((r) => r.status !== 'cancelled' && r.reference !== excludeReference)
    .map(({ date, time, tableId }) => ({ date, time, tableId }));
}

const latency = () => sleep(450 + Math.random() * 650);

async function network() {
  await latency();
  if (Math.random() < demoRate('errorRate', 0)) throw new NetworkError();
}

function find(reference: string, email: string): Reservation {
  const match = load().find(
    (r) => r.reference.toUpperCase() === reference.trim().toUpperCase() && r.guest.email.toLowerCase() === email.trim().toLowerCase(),
  );
  if (!match) throw new ReservationNotFoundError();
  return match;
}

function persist(updated: Reservation): Reservation {
  save(load().map((r) => (r.reference === updated.reference ? updated : r)));
  return updated;
}

export const localReservationService: ReservationService = {
  async getMonthAvailability(month, partySize) {
    await sleep(160);
    return getMonthAvailability(month, partySize, occupancy());
  },

  async getDaySlots(date, partySize) {
    await sleep(220);
    return getDaySlots(date, partySize, occupancy());
  },

  async getTables(date, time, partySize) {
    await sleep(180);
    return getTables(date, time, partySize, occupancy());
  },

  async createReservation(input: NewReservation) {
    await network();
    const occupied = occupancy();
    const closed = dayClosedReason(input.date);
    if (closed) throw new SlotUnavailableError(closed);

    const list = getTables(input.date, input.time, input.partySize, occupied);
    const requested = input.tableId ? list.find((t) => t.table.id === input.tableId) : undefined;
    // Simulate another guest taking the last table while this visitor was filling in the form.
    const raced = Math.random() < demoRate('conflictRate', 0.05);
    const table = requested?.status === 'free' && !raced ? requested.table : raced ? undefined : pickTable(list, input.area);

    if (!table) {
      throw new SlotUnavailableError(
        raced
          ? 'Another guest reserved this time a moment ago.'
          : 'There is no longer a table for your party at this time.',
        nearestAlternatives(input.date, input.time, input.partySize, occupied),
      );
    }

    const existing = new Set(load().map((r) => r.reference));
    let reference = generateReference();
    while (existing.has(reference)) reference = generateReference();

    const now = new Date().toISOString();
    const reservation: Reservation = {
      reference,
      status: 'requested',
      date: input.date,
      time: input.time,
      partySize: input.partySize,
      area: table.area,
      tableId: table.id,
      guest: input.guest,
      occasion: input.occasion,
      dietary: input.dietary,
      requests: input.requests,
      wishlist: input.wishlist,
      createdAt: now,
      updatedAt: now,
    };
    save([...load(), reservation]);
    return reservation;
  },

  async findReservation(reference, email) {
    await network();
    return find(reference, email);
  },

  async updateReservation(reference, email, patch) {
    await network();
    const current = find(reference, email);
    if (current.status === 'cancelled') throw new SlotUnavailableError('This reservation was cancelled.');
    const closed = dayClosedReason(patch.date);
    if (closed) throw new SlotUnavailableError(closed);

    const occupied = occupancy(current.reference);
    const list = getTables(patch.date, patch.time, patch.partySize, occupied);
    const sameTable = list.find((t) => t.table.id === current.tableId && t.status === 'free');
    const table = sameTable?.table ?? pickTable(list, current.area) ?? pickTable(list);
    if (!table) {
      throw new SlotUnavailableError(
        'No table is free for that change.',
        nearestAlternatives(patch.date, patch.time, patch.partySize, occupied),
      );
    }
    return persist({
      ...current,
      ...patch,
      tableId: table.id,
      area: table.area,
      status: 'modified',
      updatedAt: new Date().toISOString(),
    });
  },

  async cancelReservation(reference, email) {
    await network();
    const current = find(reference, email);
    return persist({ ...current, status: 'cancelled', updatedAt: new Date().toISOString() });
  },
};

export const tableLabel = (id: string) => tableById.get(id)?.label ?? id;
