import { motion, useScroll } from 'framer-motion';
import { useRef } from 'react';
import { ReserveCTA } from '@/components/home/ReserveCTA';
import { Img } from '@/components/ui/Img';
import { PageHero } from '@/components/ui/PageHero';
import { ParallaxImage } from '@/components/ui/ParallaxImage';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { accolades, chef, pillars, sourcing, team, techniques, timeline } from '@/data/story';
import { pad2 } from '@/lib/utils';
import { Reveal, RevealLines } from '@/motion/Reveal';

function Timeline() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.7', 'end 0.6'] });

  return (
    <section className="theme-ivory section-y bg-bg text-fg" aria-labelledby="timeline-title">
      <div className="container-x">
        <SectionHeading id="timeline-title" eyebrow="A brief history" lines={['Ninety-eight years', <em key="e">around one fire.</em>]} />
        <div ref={ref} className="relative mt-20">
          {/* The thread of the story draws itself as you read. */}
          <span aria-hidden className="absolute bottom-0 left-[11px] top-0 w-px bg-line/20 md:left-1/2" />
          <motion.span aria-hidden className="absolute bottom-0 left-[11px] top-0 w-px origin-top bg-accent md:left-1/2" style={{ scaleY: scrollYProgress }} />
          <ol className="relative space-y-24 md:space-y-32">
          {timeline.map((m, i) => {
            const flip = i % 2 === 1;
            return (
              <li key={m.year} className="relative grid gap-8 pl-12 md:grid-cols-2 md:gap-20 md:pl-0">
                <span aria-hidden className="absolute left-[5px] top-3 h-[13px] w-[13px] rotate-45 border border-accent bg-bg md:left-1/2 md:-translate-x-1/2" />
                <div className={flip ? 'md:order-2' : 'md:text-right'}>
                  <Reveal>
                    <p className="font-display text-[clamp(4rem,9vw,8rem)] font-light leading-none text-accent tabular">{m.year}</p>
                    <h3 className="mt-4 font-display text-3xl font-normal">{m.title}</h3>
                    <p className={`mt-4 max-w-md leading-relaxed text-muted ${flip ? '' : 'md:ml-auto'}`}>{m.body}</p>
                  </Reveal>
                </div>
                <div className={flip ? 'md:order-1' : ''}>
                  <ParallaxImage k={m.image} className="aspect-[4/3] w-full max-w-lg" arch={i % 2 === 0} sizes="(min-width: 768px) 40vw, 85vw" />
                </div>
              </li>
            );
          })}
          </ol>
        </div>
      </div>
    </section>
  );
}

export default function Story() {
  return (
    <>
      <PageHero
        image="f-hearth"
        eyebrow="Our story · since 1928"
        lines={['Three generations,', <em key="e">one fire.</em>]}
        lede="ROYAL began as fourteen seats around an oak hearth in the Old Quarter of Valmont. The fire has not gone out since."
      />

      {/* Founding */}
      <section className="section-y bg-obsidian" aria-labelledby="founding-title">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading id="founding-title" eyebrow="The founding" lines={['Marcel, Élise', <em key="e">and a pile of oak.</em>]} />
          </div>
          <div className="space-y-6 text-lg leading-relaxed text-fg/80 lg:col-span-6 lg:col-start-7">
            <Reveal>
              <p className="first-letter:float-left first-letter:mr-3 first-letter:font-display first-letter:text-[5.2rem] first-letter:leading-[0.8] first-letter:text-champagne">
                In the winter of 1928, Marcel Varenne — a butcher’s son with a cook’s temper — and Élise, who kept the books and the guests in equal order, rented a narrow room
                beside the Arcade Royale. They could afford one luxury: a hearth wide enough to roast a whole rib over oak.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <p>
                There was no menu, only what the fire was cooking that day. Within a year, the regulars had stopped calling it Le Foyer Royal and simply said they were going “to
                Royal.” The name stuck; so did the rule Élise wrote above the pass: <em className="text-champagne">nothing leaves this kitchen in a hurry.</em>
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <Timeline />

      {/* Philosophy */}
      <section className="section-y bg-obsidian" aria-labelledby="philosophy-title">
        <div className="container-x">
          <SectionHeading id="philosophy-title" eyebrow="Philosophy" lines={['Fire. Time.', <em key="e">Grace.</em>]} />
          <ol className="mt-16 grid gap-px bg-line/15 md:grid-cols-3">
            {pillars.map((p, i) => (
              <li key={p.title} className="bg-obsidian p-8 md:p-10">
                <Reveal delay={i * 0.1}>
                  <p className="text-xs text-accent tabular">{pad2(i + 1)}</p>
                  <h3 className="mt-6 font-display text-5xl font-light text-ivory">{p.title}</h3>
                  <p className="mt-6 leading-relaxed text-fg/75">{p.body}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Sourcing & techniques */}
      <section className="section-y relative overflow-hidden bg-espresso" aria-labelledby="sourcing-title">
        <div className="container-x grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading id="sourcing-title" eyebrow="Sourcing" lines={['We know', <em key="e">every farm by name.</em>]} />
            <ParallaxImage k="s-a5" className="mt-12 aspect-[4/5] w-full max-w-sm" sizes="(min-width: 1024px) 28vw, 80vw" />
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <ul className="divide-y divide-line/15 border-y border-line/15">
              {sourcing.map((s, i) => (
                <li key={s.title} className="py-7">
                  <Reveal delay={i * 0.05}>
                    <h3 className="font-display text-2xl text-ivory">{s.title}</h3>
                    <p className="mt-2 leading-relaxed text-fg/75">{s.body}</p>
                  </Reveal>
                </li>
              ))}
            </ul>
            <Reveal>
              <p className="eyebrow mb-6 mt-16">Signature techniques</p>
            </Reveal>
            <dl className="grid gap-px bg-line/15 sm:grid-cols-2">
              {techniques.map((t) => (
                <div key={t.title} className="bg-espresso p-6">
                  <dt className="font-display text-2xl text-champagne">{t.title}</dt>
                  <dd className="mt-2 text-sm leading-relaxed text-fg/75">{t.detail}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Hospitality */}
      <section className="relative overflow-hidden bg-burgundy py-28 md:py-40" aria-labelledby="hospitality-title">
        <div className="container-x relative text-center">
          <Reveal>
            <p className="eyebrow mb-8 !text-champagne-soft">Hospitality</p>
          </Reveal>
          <RevealLines
            id="hospitality-title"
            lines={['“Service should be felt,', <em key="e">never seen.”</em>]}
            className="display-xl mx-auto max-w-5xl text-ivory"
          />
          <Reveal delay={0.2}>
            <p className="mx-auto mt-10 max-w-2xl leading-relaxed text-ivory/80">
              Every member of the team learns the names of our regulars, their tables and their allergies. We pour the second glass before it is asked for — and never
              mention that we remembered.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Chef & team */}
      <section id="chef" className="theme-ivory section-y scroll-mt-10 bg-bg text-fg" aria-labelledby="team-title">
        <div className="container-x">
          <div className="grid items-end gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <ParallaxImage k={chef.image} arch className="aspect-[4/5] w-full" sizes="(min-width: 1024px) 38vw, 92vw" />
            </div>
            <div className="lg:col-span-6 lg:col-start-7">
              <Reveal>
                <p className="eyebrow mb-6">Executive chef</p>
                <h2 id="team-title" className="display-lg">
                  {chef.name}
                </h2>
                <p className="mt-3 text-xs uppercase tracking-[0.2em] text-muted">{chef.role}</p>
                <p className="mt-8 text-lg leading-relaxed">{chef.bio}</p>
                <p className="mt-5 leading-relaxed text-muted">{chef.philosophy}</p>
                <ul className="mt-8 flex flex-wrap gap-2">
                  {chef.specialties?.map((s) => (
                    <li key={s} className="border border-line/30 px-3 py-1.5 text-xs uppercase tracking-[0.14em]">
                      {s}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </div>

          <div className="mt-28">
            <Reveal>
              <p className="eyebrow mb-10">The brigade</p>
            </Reveal>
            <ul className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
              {team.map((m, i) => (
                <li key={m.name} className={i % 2 === 1 ? 'lg:mt-16' : ''}>
                  <Reveal delay={i * 0.08}>
                    <div className="group aspect-[3/4] overflow-hidden bg-surface">
                      <Img k={m.image} sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 92vw" className="h-full w-full object-cover grayscale-[35%] transition duration-[1.2s] ease-luxe group-hover:scale-105 group-hover:grayscale-0" />
                    </div>
                    <h3 className="mt-5 font-display text-2xl">{m.name}</h3>
                    <p className="text-[11px] uppercase tracking-[0.18em] text-accent">{m.role}</p>
                    <p className="mt-3 text-sm leading-relaxed text-muted">{m.bio}</p>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Accolades */}
      <section className="section-y bg-obsidian" aria-labelledby="accolades-title">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeading id="accolades-title" eyebrow="Recognition" lines={['Kind words,', <em key="e">quietly kept.</em>]} size="md" />
            <p className="mt-6 text-xs text-muted">All awards and publications are fictional, invented for this portfolio project.</p>
          </div>
          <ul className="divide-y divide-line/15 border-y border-line/15 lg:col-span-7 lg:col-start-6">
            {accolades.map((a, i) => (
              <li key={a} className="flex items-baseline gap-6 py-6">
                <span className="text-xs text-accent tabular">{pad2(i + 1)}</span>
                <span className="font-display text-2xl font-light text-ivory">{a}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <ReserveCTA />
    </>
  );
}
