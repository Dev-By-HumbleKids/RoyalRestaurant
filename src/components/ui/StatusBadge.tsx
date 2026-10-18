import { statusMeta } from '@/lib/status';
import type { SlotStatus } from '@/types';
import { cn } from '@/lib/utils';

/** Status is always conveyed by icon + text, never colour alone. */
export function StatusBadge({ status, label, className }: { status: SlotStatus; label?: string; className?: string }) {
  const { Icon, color, label: fallback } = statusMeta[status];
  return (
    <span className={cn('inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em]', color, className)}>
      <Icon aria-hidden className="h-3.5 w-3.5" strokeWidth={2} />
      {label ?? fallback}
    </span>
  );
}

export function StatusLegend({ className }: { className?: string }) {
  return (
    <ul className={cn('flex flex-wrap gap-x-6 gap-y-2', className)} aria-label="Availability legend">
      {(['available', 'limited', 'full'] as const).map((s) => (
        <li key={s}>
          <StatusBadge status={s} />
        </li>
      ))}
    </ul>
  );
}
