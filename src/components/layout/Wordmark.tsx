import { cn } from '@/lib/utils';

/**
 * ROYAL wordmark: an arch monogram beside widely tracked serif capitals. `collapse` keeps only the monogram on
 * very narrow phones (under 340px, e.g. a folded Galaxy Fold), where the header has no room for the lettering.
 */
export function Wordmark({ className, compact, collapse }: { className?: string; compact?: boolean; collapse?: boolean }) {
  return (
    <span className={cn('inline-flex items-center gap-2.5 text-fg min-[360px]:gap-3', className)}>
      <svg viewBox="0 0 28 34" className="h-8 w-[26px] shrink-0 text-accent" aria-hidden>
        <path d="M2 33V14a12 12 0 0 1 24 0v19" fill="none" stroke="currentColor" strokeWidth="1.3" />
        <path d="M7 33V15.5a7 7 0 0 1 14 0V33" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
        <circle cx="14" cy="13" r="1.4" fill="currentColor" />
      </svg>
      {!compact && (
        <span
          className={cn(
            'font-display text-[1.2rem] font-normal leading-none tracking-[0.3em] min-[360px]:text-[1.45rem] min-[360px]:tracking-[0.42em]',
            collapse && 'hidden min-[340px]:inline',
          )}
        >
          ROYAL
        </span>
      )}
    </span>
  );
}
