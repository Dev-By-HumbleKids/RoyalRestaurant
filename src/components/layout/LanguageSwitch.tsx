import { useI18n, useLang, type Lang } from '@/i18n';
import { cn } from '@/lib/utils';

/**
 * EN / MY toggle. Labels are Latin codes in both languages so the English site never shows Myanmar script;
 * the full language name is announced to screen readers.
 */
export function LanguageSwitch({ className }: { className?: string }) {
  const { t } = useI18n();
  const lang = useLang((s) => s.lang);
  const setLang = useLang((s) => s.setLang);
  const options: { value: Lang; short: string; full: string }[] = [
    { value: 'en', short: t.lang.en, full: 'English' },
    { value: 'my', short: t.lang.my, full: 'Myanmar' },
  ];

  return (
    <div role="group" aria-label={t.lang.label} className={cn('flex items-center border border-line/30 text-[11px] font-semibold tracking-[0.14em]', className)}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => setLang(o.value)}
          aria-pressed={lang === o.value}
          lang={o.value}
          className={cn(
            'h-9 min-w-[40px] px-2.5 transition-colors duration-300',
            lang === o.value ? 'bg-champagne text-obsidian' : 'text-fg/70 hover:text-fg',
          )}
        >
          <span aria-hidden>{o.short}</span>
          <span className="sr-only">{o.full}</span>
        </button>
      ))}
    </div>
  );
}
