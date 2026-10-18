import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { ButtonLink } from '@/components/ui/Button';
import { Img } from '@/components/ui/Img';
import { ParallaxImage } from '@/components/ui/ParallaxImage';
import { renderLines, useI18n } from '@/i18n';
import { Reveal, RevealLines } from '@/motion/Reveal';


/** Full-bleed vault image that opens up as it scrolls in, followed by a layered material story. */
export function ArchitectureTeaser() {
  const { t } = useI18n();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const inset = useTransform(scrollYProgress, [0, 0.45], ['12%', '0%']);
  const clip = useTransform(inset, (v) => `inset(${v} ${v} 0% ${v})`);
  const y = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);

  return (
    <section className="relative bg-obsidian pb-[clamp(5rem,11vw,10rem)]" aria-labelledby="arch-title">
      <motion.div ref={ref} className="relative h-[80svh] min-h-[520px] overflow-hidden" style={{ clipPath: clip }}>
        <motion.div className="absolute inset-[-10%_0]" style={{ y }}>
          <Img k="i-arcade" sizes="100vw" className="h-full w-full object-cover" />
        </motion.div>
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/30 to-obsidian/40" />
        <div className="container-x absolute inset-x-0 bottom-0 pb-14">
          <Reveal>
            <p className="eyebrow mb-6 flex items-center gap-4">
              <span aria-hidden className="h-px w-10 bg-accent/60" />
              {t.home.arch.eyebrow}
            </p>
          </Reveal>
          <RevealLines id="arch-title" lines={renderLines(t.home.arch.lines)} className="display-xl text-ivory" />
        </div>
      </motion.div>

      <div className="container-x mt-16 grid grid-cols-1 gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Reveal>
            <p className="lede">
              {t.home.arch.lede}
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <ol className="mt-10 grid grid-cols-2 gap-x-6 border-t border-line/15 pt-6 text-sm text-fg/80">
              {t.home.arch.rooms.map((room, i) => (
                <li key={room} className="flex gap-3 border-b border-line/10 py-3">
                  <span className="text-xs text-accent tabular">{String(i + 1).padStart(2, '0')}</span>
                  {room}
                </li>
              ))}
            </ol>
          </Reveal>
          <Reveal delay={0.2} className="mt-10">
            <ButtonLink to="/experience" variant="outline" icon>
              {t.home.arch.cta}
            </ButtonLink>
          </Reveal>
        </div>
        <div className="relative grid grid-cols-5 gap-4 lg:col-span-7 lg:pl-10">
          <ParallaxImage k="i-chandelier" className="col-span-3 aspect-[3/4]" sizes="(min-width: 1024px) 30vw, 60vw" arch />
          <div className="col-span-2 flex flex-col justify-end gap-4">
            <ParallaxImage k="i-vault-wall" className="aspect-[3/4]" sizes="(min-width: 1024px) 20vw, 40vw" strength={6} />
            <p className="text-[11px] uppercase tracking-[0.2em] text-muted">{t.home.arch.vault}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
