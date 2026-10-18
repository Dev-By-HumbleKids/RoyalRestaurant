import { BellRing, Minus, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { StatusBadge, StatusLegend } from '@/components/ui/StatusBadge';
import { areaMeta, diningAreas, tableById } from '@/data/tables';
import { useI18n } from '@/i18n';
import { cn } from '@/lib/utils';
import { reservationService } from '@/services';
import { areaStatus } from '@/services/availability';
import { RULES } from '@/services/rules';
import { useReservation } from '@/store/reservationStore';
import { useToast } from '@/store/toastStore';
import { FloorPlan } from '@/three/FloorPlan';
import type { DiningArea, TableAvailability, TimeSlot } from '@/types';
import { Calendar } from './Calendar';

export function StepTitle({ n, title, hint }: { n: number; title: string; hint?: string }) {
  const { t } = useI18n();
  return (
    <header className="mb-8">
      <p className="eyebrow mb-3">{t.reservations.stepOf(n)}</p>
      <h2 className="display-md text-ivory" tabIndex={-1} data-step-heading>
        {title}
      </h2>
      {hint && <p className="mt-3 max-w-xl text-sm text-muted">{hint}</p>}
    </header>
  );
}

// ——— Step 1: date & guests ———
export function DateStep() {
  const { partySize, date, setPartySize, setDate } = useReservation();
  const { t } = useI18n();
  const d = t.reservations.date;
  return (
    <div>
      <StepTitle n={1} title={d.title} hint={d.hint} />
      <div className="mb-10 flex flex-wrap items-center gap-6 border-y border-line/15 py-6">
        <span id="party-label" className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
          {d.guests}
        </span>
        <div className="flex items-center" role="group" aria-labelledby="party-label">
          <button
            type="button"
            onClick={() => setPartySize(Math.max(RULES.minParty, partySize - 1))}
            disabled={partySize <= RULES.minParty}
            className="grid h-12 w-12 place-items-center border border-line/30 transition-colors hover:border-accent disabled:opacity-30"
            aria-label={d.fewer}
          >
            <Minus className="h-4 w-4" aria-hidden />
          </button>
          <output className="w-20 text-center font-display text-4xl text-ivory tabular" aria-live="polite" aria-label={t.common.guests(partySize)}>
            {partySize}
          </output>
          <button
            type="button"
            onClick={() => setPartySize(Math.min(RULES.maxPartyOnline, partySize + 1))}
            disabled={partySize >= RULES.maxPartyOnline}
            className="grid h-12 w-12 place-items-center border border-line/30 transition-colors hover:border-accent disabled:opacity-30"
            aria-label={d.more}
          >
            <Plus className="h-4 w-4" aria-hidden />
          </button>
        </div>
        <p className="text-sm text-muted">
          {d.nine}{' '}
          <Link to="/contact#private-dining" className="link-underline text-accent">
            {d.inquiry}
          </Link>
        </p>
      </div>
      <Calendar partySize={partySize} value={date} onChange={setDate} />
      <StatusLegend className="mt-6" />
      <p className="mt-3 text-xs text-muted">{d.demo}</p>
    </div>
  );
}

// ——— Step 2: time ———
export function TimeStep() {
  const { date, partySize, time, setTime } = useReservation();
  const [slots, setSlots] = useState<TimeSlot[] | null>(null);
  const toast = useToast((s) => s.show);
  const { t, fmt } = useI18n();
  const tt = t.reservations.time;

  useEffect(() => {
    if (!date) return;
    let alive = true;
    setSlots(null);
    reservationService.getDaySlots(date, partySize).then((s) => alive && setSlots(s));
    return () => {
      alive = false;
    };
  }, [date, partySize]);

  if (!date) return null;
  const groups = (['lunch', 'dinner'] as const)
    .map((service) => ({ service, items: (slots ?? []).filter((s) => s.service === service) }))
    .filter((g) => g.items.length > 0);
  const anyOpen = slots?.some((s) => s.status === 'available' || s.status === 'limited');

  return (
    <div>
      <StepTitle n={2} title={tt.title(fmt.weekdayDayMonth(date), partySize)} hint={tt.hint} />
      {!slots ? (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-5" aria-busy="true" aria-label={tt.loading}>
          {Array.from({ length: 10 }, (_, i) => (
            <div key={i} className="h-[72px] animate-pulse bg-espresso" />
          ))}
        </div>
      ) : (
        <div className="space-y-10">
          {groups.map((g) => (
            <fieldset key={g.service}>
              <legend className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">{g.service === 'lunch' ? tt.lunch : tt.dinner}</legend>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
                {g.items.map((slot) => {
                  const open = slot.status === 'available' || slot.status === 'limited';
                  const selected = slot.time === time;
                  const reason = slot.reason ? t.reasons[slot.reason] : undefined;
                  const statusText = slot.status === 'limited' ? tt.limitedAria(slot.freeTables) : t.status[slot.status];
                  return (
                    <div key={slot.time} className="relative">
                      <button
                        type="button"
                        aria-pressed={selected}
                        aria-disabled={!open}
                        onClick={() => open && setTime(slot.time)}
                        aria-label={tt.slotAria(slot.time, statusText, reason)}
                        className={cn(
                          'flex min-h-[76px] w-full flex-col items-start justify-center gap-1.5 border px-4 text-left transition-colors duration-300',
                          selected ? 'border-champagne bg-champagne text-obsidian' : open ? 'border-line/20 hover:border-champagne/70' : 'cursor-not-allowed border-line/10 opacity-60',
                        )}
                      >
                        <span className={cn('font-display text-2xl tabular', selected ? 'text-obsidian' : 'text-ivory')}>{slot.time}</span>
                        {selected ? (
                          <span className="text-[10px] font-semibold uppercase tracking-[0.16em]">{tt.selected}</span>
                        ) : (
                          <StatusBadge
                            status={slot.status}
                            label={slot.status === 'limited' ? t.status.left(slot.freeTables) : slot.status === 'closed' ? reason : undefined}
                            className="!text-[10px]"
                          />
                        )}
                      </button>
                      {slot.status === 'full' && (
                        <button
                          type="button"
                          onClick={() => toast(tt.notifyToast(slot.time))}
                          className="absolute right-2 top-2 grid h-8 w-8 place-items-center text-muted hover:text-champagne"
                          aria-label={tt.notify(slot.time)}
                        >
                          <BellRing className="h-3.5 w-3.5" aria-hidden />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </fieldset>
          ))}
          {!anyOpen && (
            <p className="border border-status-full/40 p-5 text-sm text-fg/85" role="status">
              {tt.noneLeft(partySize)}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ——— Step 3: area & table ———
type Notice = { area: DiningArea; why: 'size' | 'lunch' | 'time' };

export function TableStep() {
  const { date, time, partySize, area, tableId, setArea, setTable } = useReservation();
  const [list, setList] = useState<TableAvailability[] | null>(null);
  const { t, c } = useI18n();
  const tb = t.reservations.table;

  useEffect(() => {
    if (!date || !time) return;
    let alive = true;
    setList(null);
    reservationService.getTables(date, time, partySize).then((l) => alive && setList(l));
    return () => {
      alive = false;
    };
  }, [date, time, partySize]);

  const isLunch = !!time && Number(time.slice(0, 2)) < 15;
  // Stored as facts rather than a sentence, so the message follows a language switch.
  const [notice, setNotice] = useState<Notice | null>(null);

  // A room chosen earlier (e.g. from an experience) may not suit this party or time — fall back gracefully.
  useEffect(() => {
    if (!list || !area) return;
    const meta = areaMeta[area];
    const wrongSize = partySize < meta.minParty || partySize > meta.maxParty;
    const wrongService = isLunch && meta.dinnerOnly;
    if (wrongSize || wrongService || areaStatus(list, area) === 'full') {
      setNotice({ area, why: wrongSize ? 'size' : wrongService ? 'lunch' : 'time' });
      setArea(null);
    }
  }, [list, area, partySize, isLunch, setArea]);

  if (!date || !time) return null;
  const planTables = (list ?? []).map((x) => ({
    table: x.table,
    state: area && x.table.area !== area && x.status === 'free' ? ('unsuitable' as const) : x.status,
  }));
  const areaTables = (list ?? []).filter((x) => x.table.area === area && x.status !== 'unsuitable');
  const noticeText = notice
    ? tb.switched(
        c.area(notice.area).label,
        notice.why === 'size' ? tb.whyGuests(partySize) : notice.why === 'lunch' ? tb.whyLunch : tb.whyTime(time),
      )
    : null;

  return (
    <div>
      <StepTitle n={3} title={tb.title} hint={tb.hint} />
      {noticeText && (
        <p role="status" className="mb-6 border-l-2 border-status-limited pl-4 text-sm text-fg/85">
          {noticeText}
        </p>
      )}

      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3" role="radiogroup" aria-label={tb.areaAria}>
        <AreaOption
          label={tb.noPref}
          description={tb.noPrefDesc}
          selected={area === null}
          onSelect={() => setArea(null)}
          status={list ? (list.some((x) => x.status === 'free') ? 'available' : 'full') : null}
        />
        {diningAreas.map((a) => {
          const meta = c.area(a);
          const tooSmall = partySize < meta.minParty || partySize > meta.maxParty;
          const unavailable = tooSmall || (isLunch && meta.dinnerOnly);
          const st = list ? areaStatus(list, a) : null;
          const reason = unavailable ? (isLunch && meta.dinnerOnly ? tb.dinnerOnly : tb.forGuests(meta.minParty, meta.maxParty)) : undefined;
          return (
            <AreaOption
              key={a}
              label={meta.label}
              description={meta.description}
              selected={area === a}
              disabled={unavailable || st === 'full'}
              reason={reason ?? (st === 'full' ? tb.fullAtTime : undefined)}
              status={unavailable ? null : st}
              onSelect={() => setArea(a)}
            />
          );
        })}
      </div>

      {area === 'chefs-counter' && <p className="mt-4 border-l-2 border-[#E58A55] pl-4 text-sm text-fg/80">{tb.counterNote}</p>}

      <div className="mt-10">
        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">{tb.plan(time)}</p>
          <ul className="flex flex-wrap gap-4 text-[11px] text-muted" aria-hidden>
            <li className="flex items-center gap-2">
              <span className="h-3 w-3 border border-champagne bg-champagne/20" /> {tb.free}
            </li>
            <li className="flex items-center gap-2">
              <span className="h-3 w-3 border border-status-full bg-status-full/30" /> {tb.reserved}
            </li>
            <li className="flex items-center gap-2">
              <span className="h-3 w-3 bg-champagne" /> {tb.yours}
            </li>
          </ul>
        </div>
        {list ? (
          <FloorPlan mode="select" tables={planTables} selectedId={tableId} onSelectTable={(id) => setTable(id, tableById.get(id)?.area)} />
        ) : (
          <div className="aspect-[4/3] animate-pulse bg-espresso lg:aspect-[16/10]" aria-label={tb.loading} />
        )}
      </div>

      {area && list && (
        <fieldset className="mt-8">
          <legend className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">{tb.tablesIn(c.area(area).label)}</legend>
          {areaTables.length === 0 ? (
            <p className="text-sm text-muted">{tb.noSuitable}</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                aria-pressed={tableId === null}
                onClick={() => setTable(null)}
                className={cn('min-h-[44px] border px-4 text-sm transition-colors', tableId === null ? 'border-champagne bg-champagne text-obsidian' : 'border-line/25 hover:border-line/60')}
              >
                {tb.anyTable}
              </button>
              {areaTables.map(({ table, status }) => (
                <button
                  key={table.id}
                  type="button"
                  disabled={status !== 'free'}
                  aria-pressed={tableId === table.id}
                  onClick={() => setTable(table.id, table.area)}
                  className={cn(
                    'min-h-[44px] border px-4 text-sm transition-colors disabled:cursor-not-allowed disabled:line-through disabled:opacity-40',
                    tableId === table.id ? 'border-champagne bg-champagne text-obsidian' : 'border-line/25 hover:border-line/60',
                  )}
                >
                  {tb.chip(table.label, table.maxSeats, status === 'booked')}
                </button>
              ))}
            </div>
          )}
        </fieldset>
      )}
    </div>
  );
}

function AreaOption({
  label,
  description,
  selected,
  disabled,
  reason,
  status,
  onSelect,
}: {
  label: string;
  description: string;
  selected: boolean;
  disabled?: boolean;
  reason?: string;
  status: 'available' | 'limited' | 'full' | 'closed' | null;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      aria-disabled={disabled}
      onClick={() => !disabled && onSelect()}
      className={cn(
        'flex min-h-[120px] flex-col items-start gap-2 border p-5 text-left transition-colors duration-300',
        selected ? 'border-champagne bg-champagne/10' : disabled ? 'cursor-not-allowed border-line/10 opacity-50' : 'border-line/20 hover:border-champagne/60',
      )}
    >
      <span className="flex w-full items-start justify-between gap-3">
        <span className="font-display text-2xl text-ivory">{label}</span>
        <span className={cn('mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full border', selected ? 'border-champagne' : 'border-line/40')} aria-hidden>
          {selected && <span className="h-2.5 w-2.5 rounded-full bg-champagne" />}
        </span>
      </span>
      <span className="text-sm leading-snug text-muted">{description}</span>
      {reason ? <span className="mt-auto text-[11px] uppercase tracking-[0.14em] text-muted">{reason}</span> : status && <StatusBadge status={status} className="mt-auto" />}
    </button>
  );
}
