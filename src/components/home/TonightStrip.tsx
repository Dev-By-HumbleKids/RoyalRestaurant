import { addDays, format, parseISO } from 'date-fns';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { reservationService } from '@/services';
import { toKey } from '@/services/availability';
import { useReservation } from '@/store/reservationStore';
import type { TimeSlot } from '@/types';
import { Reveal } from '@/motion/Reveal';

/** Next open evening at a glance; choosing a time jumps straight into the booking flow. */
export function TonightStrip() {
  const navigate = useNavigate();
  const [state, setState] = useState<{ date: string; slots: TimeSlot[] } | null>(null);
  const store = useReservation();

  useEffect(() => {
    let alive = true;
    (async () => {
      for (let i = 0; i < 7; i++) {
        const date = toKey(addDays(new Date(), i));
        const slots = (await reservationService.getDaySlots(date, 2)).filter((s) => s.service === 'dinner' && s.status !== 'closed');
        if (slots.some((s) => s.status !== 'full')) {
          if (alive) setState({ date, slots });
          return;
        }
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  if (!state) return <div className="h-[140px] border-b border-line/15 bg-obsidian" aria-hidden />;

  const isToday = state.date === toKey(new Date());
  const label = isToday ? 'Tonight' : format(parseISO(state.date), 'EEEE d MMMM');

  const choose = (time: string) => {
    store.reset();
    store.setPartySize(2);
    store.setDate(state.date);
    store.setTime(time);
    store.setStep(2);
    navigate('/reservations');
  };

  return (
    <section aria-labelledby="tonight-title" className="border-b border-line/15 bg-obsidian">
      <div className="container-x flex flex-col gap-6 py-10 lg:flex-row lg:items-center lg:justify-between">
        <Reveal>
          <p id="tonight-title" className="font-display text-3xl font-light text-ivory">
            {label}, <em className="text-champagne">for two</em>
          </p>
          <p className="mt-1 text-xs text-muted">Illustrative demo availability — not a live reservation system.</p>
        </Reveal>
        <ul className="flex gap-2 overflow-x-auto pb-1 scrollbar-none" aria-label={`Dinner times, ${label}`}>
          {state.slots.map((slot) => (
            <li key={slot.time}>
              <button
                type="button"
                disabled={slot.status === 'full'}
                onClick={() => choose(slot.time)}
                className="flex min-h-[64px] min-w-[104px] flex-col items-start justify-center gap-1 border border-line/20 px-4 text-left transition-colors hover:border-accent disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:border-line/20"
              >
                <span className="font-display text-xl tabular text-ivory">{slot.time}</span>
                <StatusBadge status={slot.status} label={slot.status === 'limited' ? `${slot.freeTables} left` : undefined} className="!text-[10px]" />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
