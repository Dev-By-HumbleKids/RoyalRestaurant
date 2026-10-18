import { motion } from 'framer-motion';
import { ButtonLink } from '@/components/ui/Button';
import { ParallaxImage } from '@/components/ui/ParallaxImage';
import { useI18n } from '@/i18n';
import { Reveal } from '@/motion/Reveal';
import { ease, viewportOnce } from '@/motion/tokens';

/** Ivory editorial spread — the first light section, a deliberate change of key. */
export function ChefTeaser() {
  const { t, c } = useI18n();
  const chef = c.chef;
  return (
    <section className="theme-ivory section-y relative bg-bg text-fg" aria-labelledby="chef-title">
      <div className="container-x grid items-center gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <ParallaxImage k={chef.image} arch className="aspect-[4/5] w-full max-w-md" sizes="(min-width: 1024px) 36vw, 90vw" />
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          <Reveal>
            <p className="eyebrow mb-8 flex items-center gap-4">
              <span aria-hidden className="h-px w-10 bg-accent/60" />
              {t.home.chef.eyebrow}
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <blockquote className="font-display text-[clamp(1.9rem,3.4vw,3.2rem)] font-light italic leading-[1.12]">
              “{chef.quote}”
            </blockquote>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-10 flex items-center gap-6">
              <svg viewBox="0 0 220 60" className="h-12 w-40 text-accent" aria-hidden>
                <motion.path
                  d="M6 44c18-30 30-36 34-28 5 10-14 30-6 30 10 0 22-34 32-30 8 4-6 26 2 26s16-22 24-20c7 2-2 18 5 18 9 0 15-14 24-14 8 0 4 12 11 12 10 0 20-16 30-16 9 0 6 10 14 10 8 0 14-8 22-8"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={viewportOnce}
                  transition={{ duration: 2.2, ease, delay: 0.3 }}
                />
              </svg>
              <div>
                <p id="chef-title" className="font-display text-2xl">
                  {chef.name}
                </p>
                <p className="text-xs uppercase tracking-[0.2em] text-muted">{chef.role}</p>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-10 max-w-prose leading-relaxed text-muted">{chef.philosophy}</p>
          </Reveal>
          <Reveal delay={0.25} className="mt-10">
            <ButtonLink to="/story#chef" variant="outline" icon className="!text-fg hover:!text-obsidian">
              {t.home.chef.cta}
            </ButtonLink>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
