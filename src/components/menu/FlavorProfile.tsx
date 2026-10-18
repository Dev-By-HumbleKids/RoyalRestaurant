import { motion } from 'framer-motion';
import type { FlavorProfile as Profile } from '@/types';
import { ease } from '@/motion/tokens';

const AXES: { key: keyof Profile; label: string }[] = [
  { key: 'body', label: 'Body' },
  { key: 'tannin', label: 'Tannin' },
  { key: 'acidity', label: 'Acidity' },
  { key: 'sweetness', label: 'Sweetness' },
  { key: 'fruit', label: 'Fruit' },
  { key: 'oak', label: 'Oak' },
];

export function FlavorProfile({ profile }: { profile: Profile }) {
  return (
    <div className="border border-line/20 p-5 sm:p-6">
      <p className="eyebrow mb-5">Flavour profile</p>
      <dl className="space-y-3">
        {AXES.map(({ key, label }, i) => (
          <div key={key} className="grid grid-cols-[88px_1fr_24px] items-center gap-3 text-sm">
            <dt className="text-muted">{label}</dt>
            <dd className="relative h-px bg-line/25">
              <motion.span
                className="absolute inset-y-[-1px] left-0 bg-champagne"
                initial={{ width: 0 }}
                animate={{ width: `${(profile[key] / 5) * 100}%` }}
                transition={{ duration: 0.9, ease, delay: 0.1 + i * 0.05 }}
              />
              <span className="sr-only">
                {profile[key]} out of 5
              </span>
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
