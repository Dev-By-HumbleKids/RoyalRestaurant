import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef } from 'react';
import { Img } from '@/components/ui/Img';
import { renderLines, useI18n } from '@/i18n';
import { pad2 } from '@/lib/utils';
import { Reveal, RevealLines } from '@/motion/Reveal';

/** Native horizontal scroll with snap points — swipe, trackpad, or the arrow buttons. No scroll-jacking. */
export function TastingStrip() {
  const track = useRef<HTMLOListElement>(null);
  const { t, c } = useI18n();
  const move = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const card = el.querySelector('li');
    el.scrollBy({ left: dir * ((card?.clientWidth ?? 320) + 20), behavior: 'smooth' });
  };

  return (
    <section id="tasting" className="section-y overflow-hidden bg-[#1C0F0A]" aria-labelledby="tasting-title">
      <div className="container-x">
        <div className="mb-12 flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <Reveal>
              <p className="eyebrow mb-6 flex items-center gap-4 !text-[#E58A55]">
                <span aria-hidden className="h-px w-10 bg-[#E58A55]/60" />
                {t.experience.tasting.eyebrow}
              </p>
            </Reveal>
            <RevealLines id="tasting-title" lines={renderLines(t.experience.tasting.lines)} className="display-lg text-ivory" />
            <Reveal delay={0.1}>
              <p className="lede mt-6">{t.experience.tasting.prices}</p>
            </Reveal>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => move(-1)} className="grid h-12 w-12 place-items-center rounded-full border border-line/30 text-ivory transition-colors hover:border-accent hover:text-accent" aria-label={t.experience.tasting.prev}>
              <ChevronLeft className="h-5 w-5" aria-hidden />
            </button>
            <button type="button" onClick={() => move(1)} className="grid h-12 w-12 place-items-center rounded-full border border-line/30 text-ivory transition-colors hover:border-accent hover:text-accent" aria-label={t.experience.tasting.next}>
              <ChevronRight className="h-5 w-5" aria-hidden />
            </button>
          </div>
        </div>
      </div>

      <ol
        ref={track}
        tabIndex={0}
        aria-label={t.experience.tasting.aria}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-[max(16px,calc((100vw-1440px)/2+4.2vw))] pb-6 scrollbar-none focus-visible:outline-offset-[-4px]"
      >
        {c.tastingCourses.map((course) => (
          <li key={course.n} className="w-[78vw] shrink-0 snap-start sm:w-[44vw] lg:w-[26vw]">
            <div className="arch aspect-[3/4] overflow-hidden bg-charcoal">
              <Img k={course.image} sizes="(min-width: 1024px) 26vw, 78vw" className="h-full w-full object-cover" />
            </div>
            <p className="mt-5 flex items-baseline gap-4">
              <span className="font-display text-4xl font-light text-[#E58A55] tabular">{pad2(course.n)}</span>
              <span className="font-display text-3xl font-light text-ivory">{course.name}</span>
            </p>
            <p className="mt-2 text-sm text-muted">{course.detail}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
