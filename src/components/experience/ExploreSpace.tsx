import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Img } from '@/components/ui/Img';
import { renderLines, useI18n } from '@/i18n';
import { tables } from '@/data/tables';
import { pad2 } from '@/lib/utils';
import { Reveal, RevealLines } from '@/motion/Reveal';
import { ease } from '@/motion/tokens';
import { useReservation } from '@/store/reservationStore';
import { FloorPlan } from '@/three/FloorPlan';

const idleTables = tables.map((table) => ({ table, state: 'idle' as const }));

/** Interactive map of the house: numbered hotspots on the 3D/2D plan open a short story of each room. */
export function ExploreSpace() {
  const { t, c } = useI18n();
  const spaces = c.spaces;
  const [active, setActive] = useState(spaces[2].id);
  const space = spaces.find((s) => s.id === active)!;
  const index = spaces.indexOf(space);
  const navigate = useNavigate();
  const prefill = useReservation((s) => s.prefill);

  return (
    <section id="explore" className="section-y relative overflow-hidden bg-espresso" aria-labelledby="explore-title">
      <div className="container-x">
        <div className="mb-12 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <Reveal>
              <p className="eyebrow mb-6 flex items-center gap-4">
                <span aria-hidden className="h-px w-10 bg-accent/60" />
                {t.experience.explore.eyebrow}
              </p>
            </Reveal>
            <RevealLines id="explore-title" lines={renderLines(t.experience.explore.lines)} className="display-lg text-ivory" />
          </div>
          <Reveal>
            <p className="max-w-sm text-sm text-muted">{t.experience.explore.hint}</p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <Reveal className="lg:col-span-8">
            <FloorPlan mode="explore" tables={idleTables} spaces={spaces} activeSpaceId={active} onSelectSpace={setActive} />
          </Reveal>

          <div className="lg:col-span-4" aria-live="polite">
            <AnimatePresence mode="wait">
              <motion.article
                key={space.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5, ease }}
                className="flex h-full flex-col border border-line/15 bg-obsidian/60"
              >
                <div className="aspect-[16/10] overflow-hidden bg-charcoal">
                  <Img k={space.image} sizes="(min-width: 1024px) 30vw, 92vw" className="h-full w-full object-cover" />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="eyebrow">
                    {pad2(index + 1)} · {space.kicker}
                  </p>
                  <h3 className="mt-3 font-display text-3xl font-light text-ivory">{space.name}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-fg/80">{space.body}</p>
                  {space.capacity && <p className="mt-4 text-[11px] uppercase tracking-[0.18em] text-champagne">{space.capacity}</p>}
                  {space.area && (
                    <button
                      type="button"
                      onClick={() => {
                        prefill({ area: space.area });
                        navigate('/reservations');
                      }}
                      className="group mt-auto inline-flex min-h-[44px] items-center gap-2 pt-6 text-[12px] font-semibold uppercase tracking-[0.2em] text-accent"
                    >
                      <span className="link-underline">{t.experience.explore.reserveHere}</span>
                      <ArrowUpRight className="h-4 w-4" aria-hidden />
                    </button>
                  )}
                </div>
              </motion.article>
            </AnimatePresence>
          </div>
        </div>

        <ol className="mt-8 flex flex-wrap gap-2" aria-label={t.experience.explore.rooms}>
          {spaces.map((s, i) => (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => setActive(s.id)}
                aria-pressed={s.id === active}
                className={`min-h-[40px] border px-3 text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors ${
                  s.id === active ? 'border-champagne bg-champagne text-obsidian' : 'border-line/25 text-fg/70 hover:border-line/60'
                }`}
              >
                {i + 1}. {s.name.replace('The ', '')}
              </button>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
