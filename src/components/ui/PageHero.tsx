import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, type ReactNode } from 'react';
import type { ImageKey } from '@/data/images';
import { RevealLines } from '@/motion/Reveal';
import { ease } from '@/motion/tokens';
import { Img } from './Img';

interface Props {
  eyebrow: string;
  lines: ReactNode[];
  lede?: ReactNode;
  image: ImageKey;
  children?: ReactNode;
  meta?: ReactNode;
}

/** Interior page opener: cinematic image beneath a dark gradient, oversized title, gentle scroll drift. */
export function PageHero({ eyebrow, lines, lede, image, children, meta }: Props) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const scale = useTransform(scrollYProgress, [0, 1], [1.05, 1.2]);
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);

  return (
    <section ref={ref} className="relative flex min-h-[78svh] items-end overflow-hidden bg-obsidian pb-14 pt-36 md:min-h-[86svh] md:pb-20">
      <motion.div className="absolute inset-0" style={{ y }}>
        <motion.div className="h-full w-full" style={{ scale }}>
          <Img k={image} priority sizes="100vw" className="h-full w-full object-cover opacity-60" />
        </motion.div>
      </motion.div>
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/55 to-obsidian/30" />
      <div aria-hidden className="absolute inset-y-0 left-0 w-2/3 bg-gradient-to-r from-obsidian/70 to-transparent" />

      <div className="container-x relative">
        <motion.p
          className="eyebrow mb-6 flex items-center gap-4"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease, delay: 0.2 }}
        >
          <span aria-hidden className="h-px w-10 bg-accent/60" />
          {eyebrow}
        </motion.p>
        <RevealLines as="h1" immediate delay={0.25} lines={lines} className="display-xl max-w-5xl text-ivory" />
        {lede && (
          <motion.p
            className="lede mt-8 max-w-xl text-stone"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease, delay: 0.6 }}
          >
            {lede}
          </motion.p>
        )}
        {children && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.8 }} className="mt-10">
            {children}
          </motion.div>
        )}
        {meta}
      </div>
    </section>
  );
}
