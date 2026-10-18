import { motion } from 'framer-motion';
import { useI18n } from '@/i18n';
import type { FlavorProfile as Profile } from '@/types';
import { ease } from '@/motion/tokens';

const AXES: (keyof Profile)[] = ['body', 'tannin', 'acidity', 'sweetness', 'fruit', 'oak'];

export function FlavorProfile({ profile }: { profile: Profile }) {
  const { t } = useI18n();
  return (
    <div className="border border-line/20 p-5 sm:p-6">
      <p className="eyebrow mb-5">{t.flavour.title}</p>
      <dl className="space-y-3">
        {AXES.map((key, i) => (
          <div key={key} className="grid grid-cols-[88px_1fr_24px] items-center gap-3 text-sm">
            <dt className="text-muted">{t.flavour.axes[key]}</dt>
            <dd className="relative h-px bg-line/25">
              <motion.span
                className="absolute inset-y-[-1px] left-0 bg-champagne"
                initial={{ width: 0 }}
                animate={{ width: `${(profile[key] / 5) * 100}%` }}
                transition={{ duration: 0.9, ease, delay: 0.1 + i * 0.05 }}
              />
              <span className="sr-only">{t.flavour.outOf(profile[key])}</span>
            </dd>
            <dd aria-hidden className="text-right text-xs text-fg/70 tabular">
              {profile[key]}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
