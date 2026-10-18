import { ParallaxImage } from '@/components/ui/ParallaxImage';
import { spaces } from '@/data/spaces';
import { cn, pad2 } from '@/lib/utils';
import { Reveal, RevealLines } from '@/motion/Reveal';

/** The walk-through: facade to cellar, alternating editorial spreads with material callouts. */
export function SpacesJourney() {
  return (
    <section className="section-y bg-obsidian" aria-labelledby="journey-title">
      <div className="container-x">
        <div className="mb-20 max-w-3xl">
          <Reveal>
            <p className="eyebrow mb-6 flex items-center gap-4">
              <span aria-hidden className="h-px w-10 bg-accent/60" />A walk through the house
            </p>
          </Reveal>
          <RevealLines id="journey-title" lines={['From the street', <em key="e">to the strongroom.</em>]} className="display-lg text-ivory" />
        </div>

        <ol className="space-y-28 md:space-y-40">
          {spaces.map((s, i) => {
            const flip = i % 2 === 1;
            return (
              <li key={s.id} id={`space-${s.id}`} className="grid items-center gap-10 md:grid-cols-12 md:gap-8">
                <div className={cn('md:col-span-7', flip && 'md:order-2 md:col-start-6')}>
                  <ParallaxImage
                    k={s.image}
                    arch={i % 3 === 0}
                    className={cn(i % 3 === 0 ? 'aspect-[4/5] md:mx-auto md:w-4/5' : 'aspect-[16/11]')}
                    sizes="(min-width: 768px) 55vw, 92vw"
                  />
                </div>
                <div className={cn('md:col-span-4', flip ? 'md:order-1 md:col-start-1' : 'md:col-start-9')}>
                  <Reveal>
                    <p className="flex items-baseline gap-4">
                      <span className="font-display text-6xl font-light text-champagne/80 tabular">{pad2(i + 1)}</span>
                      <span className="eyebrow">{s.kicker}</span>
                    </p>
                    <h3 className="mt-5 font-display text-[clamp(2rem,3.2vw,3rem)] font-light text-ivory">{s.name}</h3>
                    <p className="mt-5 leading-relaxed text-fg/80">{s.body}</p>
                    <ul className="mt-7 space-y-2 border-t border-line/15 pt-5 text-sm text-muted">
                      {s.materials.map((m) => (
                        <li key={m} className="flex items-center gap-3">
                          <span aria-hidden className="h-1 w-1 rotate-45 bg-champagne" />
                          {m}
                        </li>
                      ))}
                    </ul>
                    {s.capacity && <p className="mt-5 text-[11px] uppercase tracking-[0.2em] text-champagne">{s.capacity}</p>}
                  </Reveal>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
