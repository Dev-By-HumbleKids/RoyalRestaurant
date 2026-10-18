import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { usePrefersReducedMotion } from '@/hooks/useMedia';
import { useI18n } from '@/i18n';
import { ease, easeInOut } from '@/motion/tokens';

const KEY = 'royal.intro-seen';

function seenAlready(): boolean {
  try {
    return sessionStorage.getItem(KEY) === '1';
  } catch {
    return true;
  }
}

/** Captured at load, before the intro marks itself as seen — lets the hero delay its entrance. */
export const INTRO_PLAYING_ON_LOAD = !seenAlready();

/**
 * First-visit curtain: the arch monogram draws itself, then the curtain lifts.
 * Under 1.6s, skippable with any click or key, shown once per session, never with reduced motion.
 */
export function Intro() {
  const reduced = usePrefersReducedMotion();
  const { t } = useI18n();
  const [show, setShow] = useState(() => !seenAlready());

  useEffect(() => {
    if (!show) return;
    try {
      sessionStorage.setItem(KEY, '1');
    } catch {
      /* ignore */
    }
    const done = () => setShow(false);
    const t = setTimeout(done, 1550);
    window.addEventListener('keydown', done, { once: true });
    window.addEventListener('pointerdown', done, { once: true });
    return () => {
      clearTimeout(t);
      window.removeEventListener('keydown', done);
      window.removeEventListener('pointerdown', done);
    };
  }, [show]);

  if (reduced) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          aria-hidden
          className="fixed inset-0 z-[120] grid place-items-center bg-obsidian"
          exit={{ clipPath: 'inset(0 0 100% 0)' }}
          transition={{ duration: 0.9, ease: easeInOut }}
        >
          <div className="flex flex-col items-center gap-6">
            <svg viewBox="0 0 120 150" className="h-36 w-28 text-champagne">
              <motion.path
                d="M8 148V60a52 52 0 0 1 104 0v88"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.1, ease }}
              />
              <motion.path
                d="M28 148V64a32 32 0 0 1 64 0v84"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.6"
                opacity={0.6}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.1, ease, delay: 0.15 }}
              />
              <motion.text
                x="60"
                y="118"
                textAnchor="middle"
                className="font-display"
                fontSize="44"
                fill="#F4EFE6"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease, delay: 0.45 }}
              >
                R
              </motion.text>
            </svg>
            <motion.p
              className="text-[11px] font-semibold uppercase tracking-[0.5em] text-stone"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              {t.intro.since}
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
