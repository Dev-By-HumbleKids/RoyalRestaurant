import { addDays, addMonths, endOfMonth, format, getDay, isSameMonth, parseISO, startOfMonth } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { statusMeta } from '@/lib/status';
import { cn } from '@/lib/utils';
import { reservationService } from '@/services';
import { toKey } from '@/services/availability';
import { RULES } from '@/services/rules';
import type { DayAvailability } from '@/types';

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

interface Props {
  partySize: number;
  value: string | null;
  onChange: (date: string) => void;
}

/**
 * Month calendar with per-day availability for the chosen party size.
 * Roving focus: arrow keys move by day/week, Home/End jump to week edges, PageUp/PageDown change month.
 */
export function Calendar({ partySize, value, onChange }: Props) {
  const today = new Date();
  const minMonth = startOfMonth(today);
  const maxMonth = startOfMonth(addDays(today, RULES.maxDaysAhead));
  const [month, setMonth] = useState(() => (value ? startOfMonth(parseISO(value)) : minMonth));
  const [days, setDays] = useState<DayAvailability[] | null>(null);
  const [focusDate, setFocusDate] = useState<string>(value ?? toKey(today));
  const grid = useRef<HTMLDivElement>(null);
  const shouldFocus = useRef(false);

  useEffect(() => {
    let alive = true;
    setDays(null);
    reservationService.getMonthAvailability(month, partySize).then((d) => alive && setDays(d));
    return () => {
      alive = false;
    };
  }, [month, partySize]);

  useEffect(() => {
    if (!shouldFocus.current || !days) return;
    shouldFocus.current = false;
    grid.current?.querySelector<HTMLButtonElement>(`[data-date="${focusDate}"]`)?.focus();
  }, [focusDate, days]);

  const canPrev = month > minMonth;
  const canNext = month < maxMonth;
  const lead = (getDay(startOfMonth(month)) + 6) % 7; // Monday-first offset
  const byDate = new Map(days?.map((d) => [d.date, d]));

  const moveFocus = (delta: number) => {
    const next = addDays(parseISO(focusDate), delta);
    if (next < startOfMonth(today) || next > endOfMonth(maxMonth)) return;
    shouldFocus.current = true;
    if (!isSameMonth(next, month)) setMonth(startOfMonth(next));
    setFocusDate(toKey(next));
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const map: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
    if (e.key in map) {
      e.preventDefault();
      moveFocus(map[e.key]);
    } else if (e.key === 'Home' || e.key === 'End') {
      e.preventDefault();
      const dow = (getDay(parseISO(focusDate)) + 6) % 7;
      moveFocus(e.key === 'Home' ? -dow : 6 - dow);
    } else if (e.key === 'PageUp' || e.key === 'PageDown') {
      e.preventDefault();
      const target = addMonths(parseISO(focusDate), e.key === 'PageUp' ? -1 : 1);
      moveFocus(Math.round((target.getTime() - parseISO(focusDate).getTime()) / 86400000));
    }
  };

  // Keep the roving tab stop inside the visible month.
  const visibleFocus = isSameMonth(parseISO(focusDate), month) ? focusDate : toKey(month < minMonth ? today : month);

  return (
    <div className="w-full">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="font-display text-3xl font-light text-ivory" aria-live="polite">
          {format(month, 'MMMM yyyy')}
        </h3>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setMonth((m) => addMonths(m, -1))}
            disabled={!canPrev}
            className="grid h-11 w-11 place-items-center rounded-full border border-line/30 transition-colors hover:border-accent disabled:opacity-30"
            aria-label="Previous month"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => setMonth((m) => addMonths(m, 1))}
            disabled={!canNext}
            className="grid h-11 w-11 place-items-center rounded-full border border-line/30 transition-colors hover:border-accent disabled:opacity-30"
            aria-label="Next month"
          >
            <ChevronRight className="h-4 w-4" aria-hidden />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-semibold uppercase tracking-[0.16em] text-muted" aria-hidden>
        {WEEKDAYS.map((d) => (
          <span key={d} className="py-2">
            {d}
          </span>
        ))}
      </div>

      <div ref={grid} role="group" aria-label={`Dates in ${format(month, 'MMMM yyyy')}`} onKeyDown={onKeyDown} className="grid grid-cols-7 gap-1" aria-busy={!days}>
        {Array.from({ length: lead }, (_, i) => (
          <span key={`lead-${i}`} aria-hidden />
        ))}
        {Array.from({ length: endOfMonth(month).getDate() }, (_, i) => {
          const date = toKey(new Date(month.getFullYear(), month.getMonth(), i + 1));
          const info = byDate.get(date);
          const status = info?.status ?? 'closed';
          const selectable = !!info && (status === 'available' || status === 'limited');
          const selected = value === date;
          const isToday = date === toKey(today);
          const meta = statusMeta[status];
          return (
            <button
              key={date}
              type="button"
              data-date={date}
              tabIndex={date === (value && isSameMonth(parseISO(value), month) ? value : visibleFocus) ? 0 : -1}
              aria-disabled={!selectable}
              aria-pressed={selected}
              aria-label={`${format(parseISO(date), 'EEEE d MMMM')}${info ? `, ${meta.label}${info.reason ? ` — ${info.reason}` : ''}` : ', loading'}`}
              onFocus={() => setFocusDate(date)}
              onClick={() => selectable && onChange(date)}
              className={cn(
                'relative flex aspect-square min-h-[44px] flex-col items-center justify-center gap-1 border text-sm transition-colors duration-300 sm:aspect-[1/0.85]',
                selected
                  ? 'border-champagne bg-champagne text-obsidian'
                  : selectable
                    ? 'border-line/15 text-ivory hover:border-champagne/70'
                    : 'cursor-not-allowed border-transparent text-muted/40',
                !days && 'animate-pulse',
              )}
            >
              <span className={cn('tabular', isToday && !selected && 'underline decoration-champagne underline-offset-4')}>{i + 1}</span>
              {info && status !== 'closed' && (
                <span aria-hidden className={cn('h-1.5 w-1.5 rounded-full', selected ? 'bg-obsidian' : meta.dot, status === 'full' && 'opacity-60')} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
