import { ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Img } from '@/components/ui/Img';
import { type Experience } from '@/data/experiences';
import { renderLines, useI18n } from '@/i18n';
import { cn, pad2 } from '@/lib/utils';
import { Reveal, RevealLines } from '@/motion/Reveal';
import { useReservation } from '@/store/reservationStore';

/** Each experience gets its own tone — colour, border and accent — while sharing one grid. */
const tones: Record<Experience['tone'], { card: string; accent: string; body: string }> = {
  champagne: { card: 'bg-espresso border-line/20', accent: 'text-champagne', body: 'text-fg/80' },
  ember: { card: 'bg-[#2A140C] border-[#C2602F]/40', accent: 'text-[#E58A55]', body: 'text-fg/80' },
  burgundy: { card: 'bg-burgundy border-champagne/25', accent: 'text-champagne-soft', body: 'text-ivory/80' },
  noir: { card: 'bg-[#0B0B0A] border-ivory/15', accent: 'text-ivory', body: 'text-fg/75' },
  gold: { card: 'bg-[#2B2416] border-champagne/40', accent: 'text-champagne', body: 'text-fg/80' },
  ivory: { card: 'bg-ivory border-transparent text-obsidian', accent: 'text-champagne-deep', body: 'text-obsidian/75' },
};

export function ExperienceList() {
  const navigate = useNavigate();
  const prefill = useReservation((s) => s.prefill);
  const { t, c } = useI18n();

  const act = (exp: Experience) => {
    if (exp.action.kind === 'inquire') {
      navigate('/contact#private-dining');
      return;
    }
    prefill({ area: exp.action.area, occasion: exp.action.occasion, note: exp.action.note });
    navigate('/reservations');
  };

  return (
    <section id="experiences" className="section-y bg-obsidian" aria-labelledby="exp-title">
      <div className="container-x">
        <div className="mb-16 max-w-3xl">
          <Reveal>
            <p className="eyebrow mb-6 flex items-center gap-4">
              <span aria-hidden className="h-px w-10 bg-accent/60" />
              {t.experience.list.eyebrow}
            </p>
          </Reveal>
          <RevealLines id="exp-title" lines={renderLines(t.experience.list.lines)} className="display-lg text-ivory" />
          <Reveal delay={0.1}>
            <p className="lede mt-6">{t.experience.list.note}</p>
          </Reveal>
        </div>

        <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {c.experiences.map((exp, i) => {
            const tone = tones[exp.tone];
            return (
              <li key={exp.id} id={exp.id} className="scroll-mt-28">
                <Reveal delay={(i % 3) * 0.08} className="h-full">
                  <article className={cn('group flex h-full flex-col border', tone.card)}>
                    <div className="relative aspect-[16/11] overflow-hidden">
                      <Img k={exp.image} sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 92vw" className="h-full w-full object-cover transition-transform duration-[1.4s] ease-luxe group-hover:scale-105" />
                      <span className="absolute left-5 top-5 font-display text-4xl font-light text-ivory/90 tabular drop-shadow">{pad2(i + 1)}</span>
                    </div>
                    <div className="flex flex-1 flex-col p-6 sm:p-7">
                      <p className={cn('text-[11px] font-semibold uppercase tracking-[0.2em]', tone.accent)}>{exp.kicker}</p>
                      <h3 className="mt-3 font-display text-[2.1rem] font-light leading-tight">{exp.name}</h3>
                      <p className={cn('mt-3 text-sm leading-relaxed', tone.body)}>{exp.body}</p>
                      <dl className={cn('mt-6 grid grid-cols-3 gap-3 border-t pt-5 text-xs', exp.tone === 'ivory' ? 'border-obsidian/15' : 'border-line/15')}>
                        {[
                          [t.experience.list.from, exp.price],
                          [t.experience.list.duration, exp.duration],
                          [t.experience.list.party, exp.party],
                        ].map(([k, v]) => (
                          <div key={k}>
                            <dt className={cn('uppercase tracking-[0.16em]', exp.tone === 'ivory' ? 'text-obsidian/55' : 'text-muted')}>{k}</dt>
                            <dd className="mt-1 leading-snug">{v}</dd>
                          </div>
                        ))}
                      </dl>
                      <button
                        type="button"
                        onClick={() => act(exp)}
                        className={cn('group/b mt-auto inline-flex min-h-[48px] items-center gap-2 pt-6 text-[12px] font-semibold uppercase tracking-[0.2em]', tone.accent)}
                      >
                        <span className="link-underline">{exp.action.label}</span>
                        <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover/b:-translate-y-0.5 group-hover/b:translate-x-0.5" aria-hidden />
                      </button>
                    </div>
                  </article>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
