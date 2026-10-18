import type { Transition, Variants } from 'framer-motion';

export const ease = [0.22, 1, 0.36, 1] as const;
export const easeInOut = [0.76, 0, 0.24, 1] as const;

export const duration = { fast: 0.25, base: 0.6, slow: 1.1 } as const;

export const transition: Transition = { duration: duration.base, ease };

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease } },
};

export const stagger = (staggerChildren = 0.08, delayChildren = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren, delayChildren } },
});

export const viewportOnce = { once: true, margin: '0px 0px -12% 0px' } as const;
