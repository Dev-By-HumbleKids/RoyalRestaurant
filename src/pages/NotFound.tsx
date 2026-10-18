import { motion } from 'framer-motion';
import { ButtonLink } from '@/components/ui/Button';
import { ease } from '@/motion/tokens';

export default function NotFound() {
  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden bg-obsidian pt-24" aria-labelledby="nf-title">
      <div aria-hidden className="deco-fan absolute bottom-0 left-1/2 h-[70vh] w-[140vw] -translate-x-1/2 opacity-60" />
      <div className="container-x relative text-center">
        <svg viewBox="0 0 120 150" className="mx-auto h-40 w-32 text-champagne" aria-hidden>
          <motion.path d="M8 148V60a52 52 0 0 1 104 0v88" fill="none" stroke="currentColor" strokeWidth="1" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.4, ease }} />
          <text x="60" y="112" textAnchor="middle" fontSize="34" fill="#F4EFE6" fontFamily="'Cormorant Garamond', serif">
            404
          </text>
        </svg>
        <motion.h1 id="nf-title" className="display-xl mt-10 text-ivory" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease, delay: 0.3 }}>
          This table doesn’t exist… <em className="text-champagne">yet.</em>
        </motion.h1>
        <p className="lede mx-auto mt-6 max-w-md">The page you were looking for has been cleared away. Let us show you to another.</p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <ButtonLink to="/" icon>
            Back to the entrance
          </ButtonLink>
          <ButtonLink to="/menu" variant="outline">
            See the menu
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
