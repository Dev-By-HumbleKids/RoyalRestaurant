import { Check } from 'lucide-react';
import { useI18n } from '@/i18n';
import { cn } from '@/lib/utils';
import type { Step } from '@/store/reservationStore';

export function Stepper({ step, maxReached, onStep }: { step: Step; maxReached: number; onStep: (s: Step) => void }) {
  const { t } = useI18n();
  return (
    <nav aria-label={t.reservations.progress}>
      <ol className="grid grid-cols-5 gap-2">
        {t.reservations.steps.map((label, i) => {
          const done = i < step;
          const current = i === step;
          const reachable = i <= maxReached && !current;
          return (
            <li key={label}>
              <button
                type="button"
                disabled={!reachable}
                onClick={() => onStep(i as Step)}
                aria-current={current ? 'step' : undefined}
                className="group w-full py-1 text-left disabled:cursor-default"
              >
                <span className="relative block h-px w-full bg-line/20">
                  <span
                    className={cn('absolute inset-y-0 left-0 bg-champagne transition-[width] duration-700 ease-luxe', done || current ? 'w-full' : 'w-0')}
                  />
                </span>
                <span className="mt-3 flex items-center gap-2">
                  <span
                    className={cn(
                      'grid h-6 w-6 shrink-0 place-items-center rounded-full border text-[11px] lg:text-[10px] font-semibold tabular transition-colors',
                      current ? 'border-champagne bg-champagne text-obsidian' : done ? 'border-champagne text-champagne' : 'border-line/30 text-muted',
                    )}
                  >
                    {done ? <Check className="h-3 w-3" aria-hidden /> : i + 1}
                  </span>
                  <span
                    className={cn(
                      'hidden text-[11px] font-semibold uppercase tracking-[0.14em] md:block',
                      current ? 'text-ivory' : done ? 'text-fg/70 group-hover:text-champagne' : 'text-muted',
                    )}
                  >
                    {label}
                  </span>
                  <span className="sr-only md:hidden">{label}</span>
                  {done && <span className="sr-only">{t.reservations.completed}</span>}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
