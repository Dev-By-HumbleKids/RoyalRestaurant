import { ArrowUpRight } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ButtonLink } from '@/components/ui/Button';
import { Img } from '@/components/ui/Img';
import { Modal } from '@/components/ui/Modal';
import { useI18n } from '@/i18n';
import type { MenuItem } from '@/types';
import { DonenessGuide } from './DonenessGuide';
import { FlavorProfile } from './FlavorProfile';
import { WishButton } from './MenuCard';

export function MenuItemModal({ item, onClose }: { item: MenuItem | undefined; onClose: () => void }) {
  // Keep showing the last dish while the dialog animates out after the URL has changed.
  const [shown, setShown] = useState(item);
  const { t } = useI18n();
  if (item && item !== shown) setShown(item);
  return (
    <Modal open={!!item} onClose={onClose} labelledBy="dish-title" closeLabel={t.dish.close}>
      {shown && <Details key={shown.id} item={shown} />}
    </Modal>
  );
}

function Details({ item }: { item: MenuItem }) {
  const { search } = useLocation();
  const { t, c, fmt } = useI18n();
  const pairings = (item.pairingIds ?? []).map((id) => c.menuById.get(id)).filter((x): x is MenuItem => !!x);
  const s = item.steak;
  const w = item.wine;

  return (
    <div className="grid grid-cols-1 min-h-0 flex-1 overflow-y-auto lg:grid-cols-2 lg:overflow-hidden">
      <div className="relative aspect-[4/3] bg-charcoal lg:aspect-auto lg:h-full">
        <Img k={item.image} priority sizes="(min-width: 1024px) 50vw, 100vw" className="absolute inset-0 h-full w-full object-cover" />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-espresso/80 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-espresso/30" />
      </div>

      <div className="space-y-8 p-6 sm:p-10 lg:overflow-y-auto">
        <header>
          <p className="eyebrow mb-4">
            {c.categoryLabel(item.category)}
            {item.signature && ` · ${t.card.signature}`}
            {item.chefRecommended && !item.signature && ` · ${t.card.chefRec}`}
          </p>
          <h2 id="dish-title" className="display-md pr-12 text-ivory">
            {item.name}
            {w && <span className="text-stone"> {w.vintage ?? 'NV'}</span>}
          </h2>
          <p className="mt-4 flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <span className="font-display text-3xl text-champagne tabular">{fmt.price(item.price)}</span>
            {item.priceNote && <span className="text-xs uppercase tracking-[0.16em] text-muted">{item.priceNote}</span>}
            {w?.glassPrice && <span className="text-sm text-muted tabular">{t.dish.byGlass(fmt.price(w.glassPrice))}</span>}
          </p>
          <p className="mt-5 leading-relaxed text-fg/85">{item.description}</p>
          {item.story && <p className="mt-4 font-display text-xl italic leading-snug text-stone">{item.story}</p>}
          {w && <p className="mt-4 font-display text-xl italic leading-snug text-stone">{w.notes}</p>}
        </header>

        {s && (
          <dl className="grid grid-cols-2 gap-px border border-line/20 bg-line/20 text-sm sm:grid-cols-3">
            {[
              [t.dish.cut, s.cut],
              [t.dish.origin, s.origin],
              [t.dish.grade, s.grade],
              [t.dish.dryAged, s.agingDays ? t.dish.days(s.agingDays) : t.dish.notAged],
              [t.dish.weight, `${s.weightG.toLocaleString('en-US')} g`],
              [t.dish.serves, s.serves ? t.dish.servesN(s.serves) : t.dish.oneGuest],
            ].map(([k, v]) => (
              <div key={k} className="bg-espresso p-4">
                <dt className="text-[11px] lg:text-[10px] uppercase tracking-[0.18em] text-muted">{k}</dt>
                <dd className="mt-1 text-fg">{v}</dd>
              </div>
            ))}
          </dl>
        )}
        {s && <DonenessGuide />}

        {w && (
          <dl className="grid grid-cols-2 gap-px border border-line/20 bg-line/20 text-sm">
            {[
              [t.dish.producer, w.producer],
              [t.dish.region, w.region],
              [t.dish.varietal, w.varietal],
              [t.dish.vintage, w.vintage ? String(w.vintage) : t.dish.nonVintage],
            ].map(([k, v]) => (
              <div key={k} className="bg-espresso p-4">
                <dt className="text-[11px] lg:text-[10px] uppercase tracking-[0.18em] text-muted">{k}</dt>
                <dd className="mt-1 text-fg">{v}</dd>
              </div>
            ))}
          </dl>
        )}
        {w && <FlavorProfile profile={w.profile} />}

        {item.ingredients && (
          <section aria-labelledby="ingredients-h">
            <h3 id="ingredients-h" className="eyebrow mb-3">
              {t.dish.onThePlate}
            </h3>
            <ul className="flex flex-wrap gap-2">
              {item.ingredients.map((ing) => (
                <li key={ing} className="border border-line/20 px-3 py-1.5 text-sm text-fg/85">
                  {ing}
                </li>
              ))}
            </ul>
          </section>
        )}

        <section aria-labelledby="allergens-h" className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <h3 id="allergens-h" className="eyebrow mb-3">
              {t.dish.allergens}
            </h3>
            <p className="text-sm text-fg/85">{item.allergens.length ? item.allergens.map((a) => c.allergenLabel(a)).join(', ') : t.dish.noneMajor}</p>
          </div>
          <div>
            <h3 className="eyebrow mb-3">{t.dish.dietary}</h3>
            <p className="text-sm text-fg/85">{item.dietary.length ? item.dietary.map((d) => c.dietaryLabel(d)).join(', ') : '—'}</p>
          </div>
          <p className="text-xs leading-relaxed text-muted sm:col-span-2">
            {t.dish.allergyNote}
          </p>
        </section>

        {pairings.length > 0 && (
          <section aria-labelledby="pairing-h">
            <h3 id="pairing-h" className="eyebrow mb-3">
              {item.category === 'wine' ? t.dish.pairsWith : t.dish.sommelierSuggests}
            </h3>
            <ul className="divide-y divide-line/15 border-y border-line/15">
              {pairings.map((p) => (
                <li key={p.id}>
                  <Link
                    to={{ pathname: `/menu/${p.slug}`, search }}
                    replace
                    className="group flex min-h-[56px] items-center justify-between gap-4 py-3"
                  >
                    <span>
                      <span className="block font-display text-xl text-ivory group-hover:text-champagne">{p.name}</span>
                      <span className="text-xs text-muted">
                        {p.wine ? `${p.wine.region} · ${p.wine.vintage ?? 'NV'}` : c.categoryLabel(p.category)}
                      </span>
                    </span>
                    <ArrowUpRight className="h-4 w-4 text-accent" aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="flex flex-wrap items-center gap-4 border-t border-line/15 pt-8">
          <WishButton item={item} />
          <span className="text-sm text-muted">{t.dish.saveToEvening}</span>
          <ButtonLink to="/reservations" icon className="ml-auto">
            {t.common.reserveTable}
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
