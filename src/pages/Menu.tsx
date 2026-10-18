import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { MenuCard, WineRow } from '@/components/menu/MenuCard';
import { MenuItemModal } from '@/components/menu/MenuItemModal';
import { PageHero } from '@/components/ui/PageHero';
import { useToast } from '@/store/toastStore';
import { categories } from '@/data/menu';
import { renderLines, useI18n } from '@/i18n';
import { cn } from '@/lib/utils';
import { ease } from '@/motion/tokens';
import type { DietaryTag, MenuCategory, MenuItem } from '@/types';

type Sort = 'featured' | 'price-asc' | 'price-desc';
const DIETARY: DietaryTag[] = ['vegetarian', 'gluten-free', 'dairy-free', 'contains-nuts'];

const isCategory = (v: string | null): v is MenuCategory => !!v && categories.some((c) => c.id === v);

function matches(item: MenuItem, q: string) {
  const hay = [item.name, item.description, item.wine?.region, item.wine?.varietal, item.wine?.producer, ...(item.ingredients ?? [])]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
  return q
    .toLowerCase()
    .split(/\s+/)
    .every((word) => hay.includes(word));
}

function Highlight({ text, q }: { text: string; q: string }) {
  if (!q) return <>{text}</>;
  const i = text.toLowerCase().indexOf(q.toLowerCase());
  if (i < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <mark className="bg-champagne/30 text-inherit">{text.slice(i, i + q.length)}</mark>
      {text.slice(i + q.length)}
    </>
  );
}

export default function Menu() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { search } = useLocation();
  const [params, setParams] = useSearchParams();
  const toast = useToast((s) => s.show);
  const { t, c } = useI18n();
  const openItem = slug ? c.menuBySlug.get(slug) : undefined;

  // Category lives in the URL (?c=) so filters are shareable and the back button works.
  const category: MenuCategory = isCategory(params.get('c')) ? (params.get('c') as MenuCategory) : (openItem?.category ?? 'steaks');
  const [query, setQuery] = useState('');
  const [diet, setDiet] = useState<DietaryTag[]>([]);
  const [chefOnly, setChefOnly] = useState(false);
  const [sort, setSort] = useState<Sort>('featured');
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (slug && !openItem) {
      toast(t.menu.notOnMenu);
      navigate({ pathname: '/menu', search }, { replace: true });
    }
  }, [slug, openItem, navigate, search, toast, t]);

  const q = query.trim();
  const results = useMemo(() => {
    let list = q ? c.menu.filter((i) => matches(i, q)) : c.menu.filter((i) => i.category === category);
    if (diet.length) list = list.filter((i) => diet.every((d) => i.dietary.includes(d)));
    if (chefOnly) list = list.filter((i) => i.chefRecommended || i.signature);
    if (sort === 'price-asc') list = [...list].sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') list = [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [q, category, diet, chefOnly, sort, c]);

  const activeCategory = c.categories.find((cat) => cat.id === category)!;
  const filtersActive = diet.length > 0 || chefOnly || sort !== 'featured' || q.length > 0;
  const wineView = !q && category === 'wine';

  const selectCategory = (id: MenuCategory) => {
    setQuery('');
    setParams({ c: id }, { replace: false, preventScrollReset: true });
    const top = (listRef.current?.getBoundingClientRect().top ?? 0) + window.scrollY - 120;
    if (window.scrollY > top) window.scrollTo({ top, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setQuery('');
    setDiet([]);
    setChefOnly(false);
    setSort('featured');
  };

  const closeItem = () => navigate({ pathname: '/menu', search }, { preventScrollReset: true });

  return (
    <>
      <PageHero
        image="f-flames"
        eyebrow={t.menu.hero.eyebrow}
        lines={renderLines(t.menu.hero.lines)}
        lede={t.menu.hero.lede}
      />

      {/* Category bar */}
      <div className="sticky top-0 z-30 border-y border-line/15 bg-obsidian/95 backdrop-blur-md">
        <nav aria-label={t.menu.categoriesAria} className="container-x">
          <LayoutGroup id="cats">
            <ul className="-mx-2 flex gap-1 overflow-x-auto scrollbar-none">
              {c.categories.map((cat) => {
                const active = !q && cat.id === category;
                return (
                  <li key={cat.id} className="shrink-0">
                    <button
                      type="button"
                      onClick={() => selectCategory(cat.id)}
                      aria-pressed={active}
                      className={cn(
                        'relative h-14 px-3 text-[12px] font-medium uppercase tracking-[0.16em] transition-colors sm:px-4',
                        active ? 'text-champagne' : 'text-fg/65 hover:text-fg',
                      )}
                    >
                      {cat.label}
                      {active && (
                        <motion.span layoutId="cat-underline" className="absolute inset-x-3 bottom-0 h-px bg-champagne sm:inset-x-4" transition={{ duration: 0.5, ease }} />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </LayoutGroup>
        </nav>
      </div>

      <section className="bg-obsidian pb-28 pt-14" aria-labelledby="menu-section-title">
        <div className="container-x" ref={listRef}>
          {/* Filters */}
          <div className="grid grid-cols-1 gap-8 border-b border-line/15 pb-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-5">
              <AnimatePresence mode="wait">
                <motion.div key={q ? 'search' : category} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.4, ease }}>
                  <h2 id="menu-section-title" className="display-lg text-ivory">
                    {q ? t.menu.searchTitle : activeCategory.label}
                  </h2>
                  <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">
                    {q ? t.menu.searching(q) : activeCategory.intro}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="space-y-5 lg:col-span-7">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                <label className="relative flex-1">
                  <span className="sr-only">{t.menu.search}</span>
                  <Search className="pointer-events-none absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden />
                  <input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={t.menu.searchPlaceholder}
                    className="field-input pl-7"
                  />
                </label>
                <label className="flex items-center gap-3 text-sm">
                  <span className="text-[11px] uppercase tracking-[0.16em] text-muted">{t.menu.sort}</span>
                  <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="field-input w-auto bg-obsidian pr-2">
                    <option value="featured">{t.menu.sortFeatured}</option>
                    <option value="price-asc">{t.menu.sortAsc}</option>
                    <option value="price-desc">{t.menu.sortDesc}</option>
                  </select>
                </label>
              </div>
              <div className="flex flex-wrap gap-2" role="group" aria-label={t.menu.dietaryAria}>
                {DIETARY.map((d) => {
                  const on = diet.includes(d);
                  return (
                    <button
                      key={d}
                      type="button"
                      aria-pressed={on}
                      onClick={() => setDiet((cur) => (on ? cur.filter((x) => x !== d) : [...cur, d]))}
                      className={cn(
                        'min-h-[40px] border px-4 text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors',
                        on ? 'border-champagne bg-champagne text-obsidian' : 'border-line/25 text-fg/75 hover:border-line/60',
                      )}
                    >
                      {c.dietaryLabel(d)}
                    </button>
                  );
                })}
                <button
                  type="button"
                  aria-pressed={chefOnly}
                  onClick={() => setChefOnly((v) => !v)}
                  className={cn(
                    'min-h-[40px] border px-4 text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors',
                    chefOnly ? 'border-champagne bg-champagne text-obsidian' : 'border-line/25 text-fg/75 hover:border-line/60',
                  )}
                >
                  {t.menu.chefPicks}
                </button>
                {filtersActive && (
                  <button type="button" onClick={clearFilters} className="inline-flex min-h-[40px] items-center gap-1 px-2 text-[11px] uppercase tracking-[0.14em] text-muted hover:text-fg">
                    <X className="h-3.5 w-3.5" aria-hidden /> {t.menu.clear}
                  </button>
                )}
              </div>
            </div>
          </div>

          <p className="mt-6 text-xs uppercase tracking-[0.18em] text-muted" aria-live="polite">
            {t.menu.items(results.length)}
          </p>

          {/* Results */}
          {results.length === 0 ? (
            <div className="py-24 text-center">
              <p className="display-md text-ivory">{t.menu.emptyTitle}</p>
              <p className="mx-auto mt-4 max-w-sm text-sm text-muted">{t.menu.emptyBody}</p>
              <button type="button" onClick={clearFilters} className="link-underline mt-8 text-[12px] font-semibold uppercase tracking-[0.2em] text-accent">
                {t.menu.clearFilters}
              </button>
            </div>
          ) : wineView ? (
            <motion.div key={`wine-${sort}-${diet.join()}-${chefOnly}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="mt-6 border-t border-line/15">
              {results.map((item) => (
                <WineRow key={item.id} item={item} />
              ))}
            </motion.div>
          ) : (
            <motion.ul layout className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {results.map((item, i) => (
                  <motion.li
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0, transition: { duration: 0.6, ease, delay: Math.min(i, 8) * 0.04 } }}
                    exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.25 } }}
                  >
                    {q ? (
                      <div className="h-full">
                        <MenuCard item={item} />
                        <p className="mt-2 text-xs text-muted">
                          {t.menu.inCategory(c.categoryLabel(item.category))} · <Highlight text={item.name} q={q} />
                        </p>
                      </div>
                    ) : (
                      <MenuCard item={item} />
                    )}
                  </motion.li>
                ))}
              </AnimatePresence>
            </motion.ul>
          )}
        </div>
      </section>

      <MenuItemModal item={openItem} onClose={closeItem} />
    </>
  );
}
