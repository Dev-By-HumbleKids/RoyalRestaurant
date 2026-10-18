import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Img } from '@/components/ui/Img';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { categoryLabel, dietaryLabels, menuById, signatureIds } from '@/data/menu';
import { cn, kyat, pad2 } from '@/lib/utils';
import { ease } from '@/motion/tokens';
import type { MenuItem } from '@/types';

const signatures = signatureIds.map((id) => menuById.get(id)).filter((x): x is MenuItem => !!x);

function Meta({ item }: { item: MenuItem }) {
  const notes = [...item.dietary.map((d) => dietaryLabels[d]), ...(item.allergens.length ? [`Contains: ${item.allergens.join(', ')}`] : [])];
  return <p className="text-xs leading-relaxed text-muted">{notes.join(' · ')}</p>;
}

/**
 * Editorial index of the five signatures. Hovering or focusing a row swaps the large image on desktop;
 * on smaller screens each row expands with its own image.
 */
export function SignatureShowcase() {
  const [active, setActive] = useState(0);
  const current = signatures[active];

  return (
    <section className="section-y relative bg-obsidian" aria-labelledby="signatures-title">
      <div className="container-x grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-6">
          <SectionHeading
            id="signatures-title"
            eyebrow="The signatures"
            lines={['Five plates', <em key="e">that made our name.</em>]}
            lede="Each one cooked over a different fuel, each one rested as long as it took to cook."
          />

          <ol className="mt-14 border-t border-line/15">
            {signatures.map((item, i) => {
              const isActive = i === active;
              return (
                <li key={item.id} className="border-b border-line/15">
                  <button
                    type="button"
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    onClick={() => setActive(i)}
                    aria-expanded={isActive}
                    aria-controls={`sig-panel-${item.id}`}
                    className="group flex w-full items-baseline gap-5 py-6 text-left"
                  >
                    <span className={cn('w-8 shrink-0 text-xs tabular transition-colors', isActive ? 'text-accent' : 'text-muted')}>{pad2(i + 1)}</span>
                    <span
                      className={cn(
                        'flex-1 font-display text-[clamp(1.7rem,3vw,2.6rem)] font-light leading-tight transition-[color,transform] duration-500 ease-luxe',
                        isActive ? 'translate-x-2 text-ivory' : 'text-ivory/45 group-hover:text-ivory/80',
                      )}
                    >
                      {item.name}
                    </span>
                    <span className={cn('hidden text-sm tabular transition-colors sm:block', isActive ? 'text-accent' : 'text-muted')}>
                      {kyat(item.price)}
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isActive && (
                      <motion.div
                        id={`sig-panel-${item.id}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.6, ease }}
                        className="overflow-hidden lg:hidden"
                      >
                        <div className="grid gap-5 pb-8 pl-[3.25rem] sm:grid-cols-[1fr_auto]">
                          <div className="space-y-3">
                            <p className="eyebrow !text-[10px]">
                              {categoryLabel(item.category)}
                              {item.priceNote ? ` · ${item.priceNote}` : ''} · <span className="sm:hidden">{kyat(item.price)}</span>
                            </p>
                            <p className="max-w-md text-fg/85">{item.description}</p>
                            <Meta item={item} />
                            <Link to={`/menu/${item.slug}`} className="group/link inline-flex min-h-[44px] items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.2em] text-accent">
                              <span className="link-underline">View on the menu</span>
                              <ArrowUpRight className="h-4 w-4" aria-hidden />
                            </Link>
                          </div>
                          <div className="aspect-[4/3] overflow-hidden bg-charcoal sm:w-48 lg:hidden">
                            <Img k={item.image} sizes="(min-width: 640px) 192px, 90vw" className="h-full w-full object-cover" />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ol>
          <Link to="/menu?c=steaks" className="group mt-10 inline-flex min-h-[44px] items-center gap-3 text-[12px] font-semibold uppercase tracking-[0.2em] text-fg">
            <span className="link-underline">The complete menu</span>
            <ArrowUpRight className="h-4 w-4 text-accent transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
          </Link>
        </div>

        <div className="hidden lg:col-span-6 lg:block">
          <div className="sticky top-28">
            <div className="relative aspect-[4/5] overflow-hidden bg-charcoal" data-cursor="View">
              <AnimatePresence initial={false}>
                <motion.div
                  key={current.id}
                  className="absolute inset-0"
                  initial={{ clipPath: 'inset(0% 0% 100% 0%)', scale: 1.08 }}
                  animate={{ clipPath: 'inset(0% 0% 0% 0%)', scale: 1 }}
                  exit={{ opacity: 0.4 }}
                  transition={{ duration: 1, ease }}
                >
                  <Link to={`/menu/${current.slug}`} aria-label={`View ${current.name}`} tabIndex={-1}>
                    <Img k={current.image} sizes="45vw" className="h-full w-full object-cover" />
                  </Link>
                </motion.div>
              </AnimatePresence>
              <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-obsidian/70 via-transparent to-transparent" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between p-8">
                <p className="font-display text-3xl italic text-ivory">{current.name}</p>
                <p className="text-sm text-champagne tabular">{kyat(current.price)}</p>
              </div>
            </div>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={current.id}
                className="mt-6 grid grid-cols-[1fr_auto] gap-8"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.45, ease }}
                aria-live="polite"
              >
                <div className="space-y-2">
                  <p className="eyebrow !text-[10px]">
                    {categoryLabel(current.category)}
                    {current.priceNote ? ` · ${current.priceNote}` : ''}
                  </p>
                  <p className="max-w-md text-fg/85">{current.description}</p>
                  <Meta item={current} />
                </div>
                <Link
                  to={`/menu/${current.slug}`}
                  className="group/link inline-flex min-h-[44px] items-start gap-2 pt-1 text-[12px] font-semibold uppercase tracking-[0.2em] text-accent"
                >
                  <span className="link-underline">View dish</span>
                  <ArrowUpRight className="h-4 w-4" aria-hidden />
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
