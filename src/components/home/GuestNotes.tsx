import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { useEffect, useState } from 'react';
import { testimonials } from '@/data/story';
import { usePrefersReducedMotion } from '@/hooks/useMedia';
import { cn, pad2 } from '@/lib/utils';
import { Reveal } from '@/motion/Reveal';
import { ease } from '@/motion/tokens';

/** Cross-fading sample guest notes — clearly labelled as fictional, with pause and manual controls. */
export function GuestNotes() {
  const reduced = usePrefersReducedMotion();
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(!reduced);
  const [hovered, setHovered] = useState(false);
  const note = testimonials[index];
  const go = (d: number) => setIndex((i) => (i + d + testimonials.length) % testimonials.length);

  useEffect(() => {
    if (!playing || hovered) return;
    const t = setTimeout(() => go(1), 6500);
    return () => clearTimeout(t);
  }, [index, playing, hovered]);

  return (
    <section
      className="section-y relative overflow-hidden bg-burgundy"
      aria-labelledby="notes-title"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
    >
      <div aria-hidden className="pointer-events-none absolute -left-40 top-0 font-display text-[28rem] leading-none text-obsidian/25">
        “
      </div>
      <div className="container-x relative grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Reveal>
            <p className="eyebrow mb-6 flex items-center gap-4 !text-champagne-soft">
              <span aria-hidden className="h-px w-10 bg-champagne/60" />
              Guest notes
            </p>
            <h2 id="notes-title" className="display-md text-ivory">
              What stays with people.
            </h2>
            <p className="mt-6 max-w-xs text-sm text-ivory/70">Sample guest notes — fictional demonstration content, not verified reviews.</p>
          </Reveal>
        </div>

        <div className="lg:col-span-8">
          <div className="relative min-h-[260px] md:min-h-[220px]" aria-live="polite">
            <AnimatePresence mode="wait">
              <motion.figure
                key={index}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.7, ease }}
              >
                <blockquote className="font-display text-[clamp(1.7rem,3vw,2.7rem)] font-light leading-[1.18] text-ivory">“{note.quote}”</blockquote>
                <figcaption className="mt-8 text-[12px] uppercase tracking-[0.22em] text-ivory/70">
                  {note.name} <span className="text-champagne">·</span> {note.context}
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>

          <div className="mt-10 flex items-center gap-6">
            <div className="flex gap-2">
              <button type="button" onClick={() => go(-1)} className="grid h-11 w-11 place-items-center rounded-full border border-ivory/25 text-ivory transition-colors hover:border-champagne hover:text-champagne" aria-label="Previous note">
                <ChevronLeft className="h-4 w-4" aria-hidden />
              </button>
              <button type="button" onClick={() => go(1)} className="grid h-11 w-11 place-items-center rounded-full border border-ivory/25 text-ivory transition-colors hover:border-champagne hover:text-champagne" aria-label="Next note">
                <ChevronRight className="h-4 w-4" aria-hidden />
              </button>
              <button
                type="button"
                onClick={() => setPlaying((p) => !p)}
                className="grid h-11 w-11 place-items-center rounded-full text-ivory/70 transition-colors hover:text-champagne"
                aria-label={playing ? 'Pause rotation' : 'Play rotation'}
              >
                {playing ? <Pause className="h-4 w-4" aria-hidden /> : <Play className="h-4 w-4" aria-hidden />}
              </button>
            </div>
            <ol className="flex flex-1 gap-2" aria-label="Choose a note">
              {testimonials.map((t, i) => (
                <li key={t.name} className="flex-1">
                  <button
                    type="button"
                    onClick={() => setIndex(i)}
                    aria-label={`Note ${i + 1} of ${testimonials.length}`}
                    aria-current={i === index}
                    className="block w-full py-4"
                  >
                    <span className={cn('block h-px transition-colors duration-500', i === index ? 'bg-champagne' : 'bg-ivory/20')} />
                  </button>
                </li>
              ))}
            </ol>
            <span className="text-xs text-ivory/60 tabular">
              {pad2(index + 1)} / {pad2(testimonials.length)}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
