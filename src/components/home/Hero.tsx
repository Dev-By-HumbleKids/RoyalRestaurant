import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion';
import { useRef, type PointerEvent } from 'react';
import { INTRO_PLAYING_ON_LOAD } from '@/components/layout/Intro';
import { ButtonLink } from '@/components/ui/Button';
import { Img } from '@/components/ui/Img';
import { site } from '@/data/site';
import { useFinePointer, usePrefersReducedMotion } from '@/hooks/useMedia';
import { RevealLines } from '@/motion/Reveal';
import { ease } from '@/motion/tokens';

/**
 * Opening viewport. Three depth layers — Art Deco fan, outlined arch, photographed arch — drift at
 * different rates with the pointer (desktop) and with scroll, giving perspective without WebGL.
 */
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const fine = useFinePointer();
  const reduced = usePrefersReducedMotion();
  const delay = INTRO_PLAYING_ON_LOAD && !reduced ? 1.25 : 0.1;

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const imgScale = useTransform(scrollYProgress, [0, 1], [1.06, 1.28]);
  const archY = useTransform(scrollYProgress, [0, 1], ['0%', '12%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '22%']);
  const fade = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  const px = useSpring(useMotionValue(0), { stiffness: 60, damping: 20 });
  const py = useSpring(useMotionValue(0), { stiffness: 60, damping: 20 });
  const fanX = useTransform(px, (v) => v * -14);
  const fanY = useTransform(py, (v) => v * -10);
  const outlineX = useTransform(px, (v) => v * 26);
  const outlineY = useTransform(py, (v) => v * 18);
  const photoX = useTransform(px, (v) => v * 10);

  const onPointerMove = (e: PointerEvent<HTMLElement>) => {
    if (!fine || reduced) return;
    px.set(e.clientX / window.innerWidth - 0.5);
    py.set(e.clientY / window.innerHeight - 0.5);
  };

  return (
    <section ref={ref} onPointerMove={onPointerMove} aria-labelledby="hero-title" className="relative overflow-hidden bg-obsidian">
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_72%_88%,rgba(194,96,47,0.2),transparent_55%),radial-gradient(ellipse_at_20%_10%,rgba(74,24,37,0.35),transparent_50%)]"
      />

      <div className="container-x relative grid min-h-[100svh] grid-cols-1 items-center gap-y-8 pb-20 pt-24 sm:pt-28 lg:grid-cols-12 lg:gap-x-10 lg:pb-16">
        {/* Text */}
        <motion.div style={{ y: textY, opacity: fade }} className="relative z-10 order-2 lg:order-1 lg:col-span-7">
          <motion.p
            className="eyebrow mb-7 flex items-center gap-4"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease, delay }}
          >
            <span aria-hidden className="h-px w-10 bg-accent/60" />
            Est. {site.established} · Old Quarter, Valmont
          </motion.p>
          <RevealLines
            as="h1"
            id="hero-title"
            immediate
            delay={delay + 0.1}
            stagger={0.12}
            className="display-hero text-ivory"
            lines={[
              'Fire,',
              <span key="t" className="pl-[0.6em] italic text-champagne">
                Time
              </span>,
              '& Grace.',
            ]}
          />
          <motion.p
            className="lede mt-8 max-w-md"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease, delay: delay + 0.55 }}
          >
            {site.statement} Beef aged for up to ninety days, a vault of three thousand bottles, and a table kept for you.
          </motion.p>
          <motion.div
            className="mt-10 flex flex-wrap items-center gap-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease, delay: delay + 0.7 }}
          >
            <ButtonLink to="/reservations" icon magnetic>
              Reserve a Table
            </ButtonLink>
            <ButtonLink to="/menu" variant="outline" magnetic>
              Explore the Menu
            </ButtonLink>
          </motion.div>
        </motion.div>

        {/* Arch composition */}
        <div className="relative order-1 flex justify-center lg:order-2 lg:col-span-5 lg:justify-end">
          <motion.div
            aria-hidden
            style={{ x: fanX, y: fanY }}
            className="deco-fan absolute bottom-[-6%] left-1/2 h-[120%] w-[160%] -translate-x-1/2"
          />
          <div className="relative w-[min(48vw,220px)] sm:w-[min(44vw,320px)] lg:w-[min(30vw,430px)]">
            <motion.div
              aria-hidden
              style={{ x: outlineX, y: outlineY }}
              className="arch absolute -right-5 -top-5 h-full w-full border border-champagne/45"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.4, delay: delay + 0.6 }}
            />
            <motion.div style={{ y: archY, x: photoX }} className="relative">
              <motion.div
                className="arch relative aspect-[3/4] overflow-hidden bg-charcoal lg:aspect-[3/4.3]"
                initial={{ clipPath: 'inset(100% 0% 0% 0%)' }}
                animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
                transition={{ duration: 1.5, ease, delay }}
              >
                <motion.div className="h-full w-full" style={{ scale: imgScale }}>
                  <Img k="i-dining-room" priority sizes="(min-width: 1024px) 32vw, 64vw" className="h-full w-full object-cover" />
                </motion.div>
                <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-obsidian/50 via-transparent to-transparent" />
              </motion.div>
              <motion.p
                className="mt-4 flex items-center justify-between text-[11px] uppercase tracking-[0.22em] text-muted"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: delay + 1, duration: 0.8 }}
              >
                <span>The Main Dining Room</span>
                <span className="tabular">21:40</span>
              </motion.p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom rail */}
      <motion.div
        className="container-x pointer-events-none absolute inset-x-0 bottom-6 hidden items-end justify-between text-[11px] uppercase tracking-[0.24em] text-muted lg:flex"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 1.1, duration: 0.8 }}
      >
        <span className="flex items-center gap-4">
          <span className="relative block h-12 w-px overflow-hidden bg-line/20" aria-hidden>
            <span className="absolute inset-0 animate-scroll-cue bg-champagne" />
          </span>
          Scroll
        </span>
        <span>Tue – Sun · Dinner from 18:00</span>
        <span>No. 1 Arcade Royale</span>
      </motion.div>
    </section>
  );
}
