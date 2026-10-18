import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { easeInOut } from '@/motion/tokens';

/**
 * Route transition: an espresso curtain with a champagne edge covers the old page (exit) and lifts
 * off the new one (enter). ~350ms each way. With reduced motion the curtain is skipped by MotionConfig.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
        {children}
      </motion.div>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[70] origin-top bg-espresso"
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0, transition: { duration: 0.5, ease: easeInOut, delay: 0.05 } }}
        exit={{ scaleY: 0 }}
      >
        <div className="absolute inset-x-0 bottom-0 h-px bg-champagne/70" />
      </motion.div>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[70] origin-bottom bg-espresso"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 0 }}
        exit={{ scaleY: 1, transition: { duration: 0.35, ease: easeInOut } }}
      >
        <div className="absolute inset-x-0 top-0 h-px bg-champagne/70" />
      </motion.div>
    </>
  );
}
