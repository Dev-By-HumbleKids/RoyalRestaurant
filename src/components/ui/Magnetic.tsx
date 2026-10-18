import { motion, useMotionValue, useSpring } from 'framer-motion';
import type { PointerEvent, ReactNode } from 'react';
import { useFinePointer, usePrefersReducedMotion } from '@/hooks/useMedia';

/** Subtle magnetic pull toward the pointer on desktop. Inert on touch devices and with reduced motion. */
export function Magnetic({ children, strength = 0.22 }: { children: ReactNode; strength?: number }) {
  const fine = useFinePointer();
  const reduced = usePrefersReducedMotion();
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 18, mass: 0.4 });
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 18, mass: 0.4 });

  if (!fine || reduced) return <>{children}</>;

  const onMove = (e: PointerEvent<HTMLSpanElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.span className="inline-flex" style={{ x, y }} onPointerMove={onMove} onPointerLeave={reset}>
      {children}
    </motion.span>
  );
}
