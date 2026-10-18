import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useFinePointer, usePrefersReducedMotion } from '@/hooks/useMedia';

/**
 * A quiet custom cursor for desktop only. It never replaces the system cursor —
 * it adds a trailing ring that expands into a label over elements marked with `data-cursor="View"`.
 */
export function Cursor() {
  const fine = useFinePointer();
  const reduced = usePrefersReducedMotion();
  if (!fine || reduced) return null;
  return <CursorRing />;
}

function CursorRing() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 380, damping: 32, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 380, damping: 32, mass: 0.5 });
  const [label, setLabel] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
    };
    const over = (e: PointerEvent) => {
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>('[data-cursor]');
      setLabel(el?.dataset.cursor ?? null);
    };
    const leave = () => setVisible(false);
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerover', over, { passive: true });
    document.documentElement.addEventListener('pointerleave', leave);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerover', over);
      document.documentElement.removeEventListener('pointerleave', leave);
    };
  }, [x, y]);

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[95]"
      style={{ x: sx, y: sy, opacity: visible ? 1 : 0 }}
    >
      <motion.div
        className="-translate-x-1/2 -translate-y-1/2 rounded-full border border-champagne/70"
        animate={label ? { width: 88, height: 88, backgroundColor: 'rgba(197,164,109,0.92)' } : { width: 30, height: 30, backgroundColor: 'rgba(197,164,109,0)' }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <AnimatePresence>
          {label && (
            <motion.span
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="grid h-full w-full place-items-center text-[10px] font-semibold uppercase tracking-[0.2em] text-obsidian"
            >
              {label}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
