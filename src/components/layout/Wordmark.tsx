import { cn } from '@/lib/utils';

/** ROYAL wordmark: an arch monogram beside widely tracked serif capitals. */
export function Wordmark({ className, compact }: { className?: string; compact?: boolean }) {
  return (
    <span className={cn('inline-flex items-center gap-3 text-fg', className)}>
      <svg viewBox="0 0 28 34" className="h-8 w-[26px] shrink-0 text-accent" aria-hidden>
        <path d="M2 33V14a12 12 0 0 1 24 0v19" fill="none" stroke="currentColor" strokeWidth="1.3" />
        <path d="M7 33V15.5a7 7 0 0 1 14 0V33" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
        <circle cx="14" cy="13" r="1.4" fill="currentColor" />
      </svg>
      {!compact && <span className="font-display text-[1.45rem] font-normal leading-none tracking-[0.42em]">ROYAL</span>}
    </span>
  );
}
