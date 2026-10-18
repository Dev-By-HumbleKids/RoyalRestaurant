import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Heart } from 'lucide-react';
import type { PointerEvent } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Img } from '@/components/ui/Img';
import { useToast } from '@/store/toastStore';
import { useI18n } from '@/i18n';
import { useFinePointer, usePrefersReducedMotion } from '@/hooks/useMedia';
import { cn } from '@/lib/utils';
import { useWishlist } from '@/store/wishlistStore';
import type { MenuItem } from '@/types';

export function WishButton({ item, className }: { item: MenuItem; className?: string }) {
  const saved = useWishlist((s) => s.ids.includes(item.id));
  const toggle = useWishlist((s) => s.toggle);
  const toast = useToast((s) => s.show);
  const { t } = useI18n();
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(item.id);
        toast(saved ? t.card.removed(item.name) : t.card.saved(item.name));
      }}
      aria-pressed={saved}
      aria-label={saved ? t.card.remove(item.name) : t.card.save(item.name)}
      className={cn(
        'grid h-11 w-11 place-items-center rounded-full border backdrop-blur-sm transition-colors duration-300',
        saved ? 'border-champagne bg-champagne text-obsidian' : 'border-ivory/30 bg-obsidian/40 text-ivory hover:border-champagne hover:text-champagne',
        className,
      )}
    >
      <Heart className="h-4 w-4" fill={saved ? 'currentColor' : 'none'} aria-hidden />
    </button>
  );
}

/** Food card with a gentle 3D tilt on desktop. The whole card links to the deep-linkable detail view. */
export function MenuCard({ item }: { item: MenuItem }) {
  const { search } = useLocation();
  const { t, c, fmt } = useI18n();
  const fine = useFinePointer();
  const reduced = usePrefersReducedMotion();
  const mx = useSpring(useMotionValue(0), { stiffness: 160, damping: 18 });
  const my = useSpring(useMotionValue(0), { stiffness: 160, damping: 18 });
  const rotateY = useTransform(mx, [-0.5, 0.5], [-6, 6]);
  const rotateX = useTransform(my, [-0.5, 0.5], [5, -5]);
  const tilt = fine && !reduced;

  const onMove = (e: PointerEvent<HTMLElement>) => {
    if (!tilt) return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const reset = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.article
      className="group relative h-full [perspective:1200px]"
      onPointerMove={onMove}
      onPointerLeave={reset}
    >
      <motion.div style={tilt ? { rotateX, rotateY, transformStyle: 'preserve-3d' } : undefined} className="h-full">
        <Link
          to={{ pathname: `/menu/${item.slug}`, search }}
          className="press flex h-full flex-col border border-line/15 bg-espresso/60 transition-colors duration-500 hover:border-line/40"
          data-cursor={t.common.viewCursor}
          aria-label={t.card.viewDetails(item.name, `${fmt.price(item.price)}${item.priceNote ? ` ${item.priceNote}` : ''}`)}
        >
          <div className="relative aspect-[4/3] overflow-hidden bg-charcoal">
            <Img
              k={item.image}
              alt=""
              sizes="(min-width: 1280px) 30vw, (min-width: 640px) 45vw, 92vw"
              className="h-full w-full object-cover transition-transform duration-[1.2s] ease-luxe group-hover:scale-[1.06]"
            />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-obsidian/50 via-transparent to-transparent" />
            {(item.chefRecommended || item.signature) && (
              <span className="absolute left-4 top-4 bg-obsidian/75 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-champagne backdrop-blur-sm">
                {item.signature ? t.card.signature : t.card.chefRec}
              </span>
            )}
          </div>
          <div className="flex flex-1 flex-col p-5 sm:p-6">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h3 className="min-w-0 font-display text-[1.5rem] font-normal leading-tight text-ivory transition-colors group-hover:text-champagne [overflow-wrap:anywhere] min-[400px]:text-[1.65rem]">
                {item.name}
              </h3>
              <p className="shrink-0 text-right">
                <span className="text-base text-champagne tabular">{fmt.price(item.price)}</span>
                {item.priceNote && <span className="block text-[11px] uppercase tracking-[0.14em] text-muted">{item.priceNote}</span>}
              </p>
            </div>
            <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-fg/75">{item.description}</p>
            <p className="mt-auto pt-5 text-[11px] uppercase tracking-[0.14em] text-muted">
              {item.dietary.length
                ? item.dietary.map((d) => c.dietaryLabel(d)).join(' · ')
                : item.allergens.length
                  ? t.card.contains(item.allergens.slice(0, 3).map((a) => c.allergenLabel(a)).join(', '))
                  : t.card.noAllergens}
            </p>
          </div>
        </Link>
      </motion.div>
      <WishButton item={item} className="absolute right-4 top-4 z-10" />
    </motion.article>
  );
}

/** Wine & champagne are presented as a list, the way a cellar book reads. */
export function WineRow({ item }: { item: MenuItem }) {
  const { search } = useLocation();
  const { t, c, fmt } = useI18n();
  const w = item.wine!;
  return (
    <article className="group relative border-b border-line/15">
      <Link
        to={{ pathname: `/menu/${item.slug}`, search }}
        className="grid grid-cols-1 gap-3 py-6 pr-14 transition-colors sm:grid-cols-[80px_1fr_auto] sm:items-center sm:gap-6"
        aria-label={t.card.viewDetails(`${item.name} ${w.vintage ?? 'NV'}`, `${fmt.price(item.price)} / ${t.card.bottle}`)}
      >
        <span className="hidden aspect-[3/4] w-20 overflow-hidden bg-charcoal sm:block">
          <Img k={item.image} alt="" sizes="80px" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
        </span>
        <span>
          <span className="eyebrow !text-[11px]">
            {c.wineStyle(w.style)} · {w.region}
          </span>
          <span className="mt-1 block font-display text-2xl text-ivory transition-colors group-hover:text-champagne sm:text-[1.7rem]">
            {item.name} <span className="text-stone tabular">{w.vintage ?? 'NV'}</span>
          </span>
          <span className="mt-1 block text-sm text-muted">
            {w.producer} · {w.varietal}
          </span>
        </span>
        <span className="flex gap-8 text-sm tabular sm:flex-col sm:gap-1 sm:text-right">
          <span>
            <span className="text-muted">{t.card.bottle} </span>
            <span className="text-champagne">{fmt.price(item.price)}</span>
          </span>
          {w.glassPrice && (
            <span>
              <span className="text-muted">{t.card.glass} </span>
              <span className="text-fg">{fmt.price(w.glassPrice)}</span>
            </span>
          )}
        </span>
      </Link>
      <WishButton item={item} className="absolute right-0 top-1/2 -translate-y-1/2" />
    </article>
  );
}
