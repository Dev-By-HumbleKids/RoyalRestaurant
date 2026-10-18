import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Img } from '@/components/ui/Img';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { renderLines, useI18n } from '@/i18n';
import { cn } from '@/lib/utils';
import { Reveal } from '@/motion/Reveal';

const FEATURED = ['signature-dining', 'chefs-tasting', 'private-dining'];

export function ExperiencesTeaser() {
  const { t, c } = useI18n();
  const featured = FEATURED.map((id) => c.experiences.find((e) => e.id === id)!);
  return (
    <section className="section-y relative overflow-hidden bg-espresso" aria-labelledby="ways-title">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-10 md:flex-row md:items-end">
          <SectionHeading id="ways-title" eyebrow={t.home.ways.eyebrow} lines={renderLines(t.home.ways.lines)} />
          <Reveal>
            <Link to="/experience#experiences" className="group inline-flex min-h-[44px] items-center gap-3 text-[12px] font-semibold uppercase tracking-[0.2em]">
              <span className="link-underline">{t.home.ways.all}</span>
              <ArrowUpRight className="h-4 w-4 text-accent transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
            </Link>
          </Reveal>
        </div>

        <ul className="mt-16 grid gap-12 md:grid-cols-3 md:gap-8">
          {featured.map((exp, i) => (
            <li key={exp.id} className={cn(i === 1 && 'md:mt-24', i === 2 && 'md:mt-10')}>
              <Reveal delay={i * 0.1}>
                <Link to={`/experience#${exp.id}`} className="group block" data-cursor={t.common.viewCursor}>
                  <div className="arch relative aspect-[3/4] overflow-hidden bg-charcoal">
                    <Img
                      k={exp.image}
                      sizes="(min-width: 768px) 30vw, 90vw"
                      className="h-full w-full object-cover transition-transform duration-[1.4s] ease-luxe group-hover:scale-105"
                    />
                    <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-obsidian/60 to-transparent" />
                    <span className="absolute bottom-5 left-6 text-[11px] uppercase tracking-[0.22em] text-ivory/80">{exp.kicker}</span>
                  </div>
                  <div className="mt-6 flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-display text-3xl font-light text-ivory transition-colors group-hover:text-champagne">{exp.name}</h3>
                      <p className="mt-2 text-sm text-muted">
                        {exp.price} · {exp.party}
                      </p>
                    </div>
                    <span className="mt-1 grid h-11 w-11 shrink-0 place-items-center rounded-full border border-line/30 transition-colors duration-500 group-hover:border-accent group-hover:bg-champagne group-hover:text-obsidian">
                      <ArrowUpRight className="h-4 w-4" aria-hidden />
                    </span>
                  </div>
                  <p className="mt-4 max-w-sm text-sm leading-relaxed text-fg/75">{exp.body}</p>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
