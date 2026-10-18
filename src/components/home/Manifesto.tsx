import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { useRef } from 'react';
import { Reveal } from '@/motion/Reveal';

const TEXT =
  'Some things cannot be rushed. Our beef rests for up to ninety days. Our wines, for decades. Your evening, for as long as you wish.';

const FACTS = [
  { value: '1928', label: 'The hearth was first lit' },
  { value: '45–90', label: 'Days of dry ageing' },
  { value: '3,000+', label: 'Bottles in the Vault' },
  { value: '8', label: 'Seats at the Chef’s Counter' },
];

function Word({ word, progress, range }: { word: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.16, 1]);
  return (
    <motion.span style={{ opacity }} className="inline-block pr-[0.25em]">
      {word}
    </motion.span>
  );
}

/** Words brighten as the reader scrolls through them — the scroll only reveals, never hijacks. */
export function Manifesto() {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.45'] });
  const words = TEXT.split(' ');

  return (
    <section className="section-y relative bg-obsidian" aria-label="Our philosophy">
      <div className="container-x">
        <Reveal>
          <p className="eyebrow mb-10 flex items-center gap-4">
            <span aria-hidden className="h-px w-10 bg-accent/60" />
            The house philosophy
          </p>
        </Reveal>
        <p ref={ref} className="max-w-6xl font-display text-[clamp(2rem,4.6vw,4.4rem)] font-light leading-[1.08] text-ivory">
          {words.map((w, i) => (
            <Word key={i} word={w} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} />
          ))}
        </p>

        <dl className="mt-20 grid grid-cols-2 border-t border-line/15 md:grid-cols-4">
          {FACTS.map((f, i) => (
            <Reveal key={f.label} delay={i * 0.08} className="flex flex-col border-b border-line/15 py-8 pr-6 md:border-b-0 md:border-r md:last:border-r-0 md:pl-6 md:first:pl-0">
              <dt className="order-2 mt-3 text-[11px] uppercase tracking-[0.2em] text-muted">{f.label}</dt>
              <dd className="font-display text-5xl font-light text-champagne tabular md:text-6xl">{f.value}</dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
