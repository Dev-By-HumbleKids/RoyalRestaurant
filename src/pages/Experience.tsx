import { LayoutGroup, motion } from 'framer-motion';
import { useState } from 'react';
import { ExperienceList } from '@/components/experience/ExperienceList';
import { ExploreSpace } from '@/components/experience/ExploreSpace';
import { SpacesJourney } from '@/components/experience/SpacesJourney';
import { TastingStrip } from '@/components/experience/TastingStrip';
import { GalleryGrid } from '@/components/gallery/GalleryGrid';
import { ButtonLink } from '@/components/ui/Button';
import { PageHero } from '@/components/ui/PageHero';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { galleryCategories, type GalleryCategory } from '@/data/experiences';
import { renderLines, useI18n } from '@/i18n';
import { cn } from '@/lib/utils';
import { ease } from '@/motion/tokens';

export default function Experience() {
  const [filter, setFilter] = useState<GalleryCategory>('All');
  const { t, c } = useI18n();
  const items = filter === 'All' ? c.gallery : c.gallery.filter((g) => g.category === filter);

  return (
    <>
      <PageHero
        image="i-arch-facade"
        eyebrow={t.experience.hero.eyebrow}
        lines={renderLines(t.experience.hero.lines)}
        lede={t.experience.hero.lede}
      >
        <div className="flex flex-wrap gap-4">
          <ButtonLink to="/experience#explore" icon>
            {t.experience.hero.explore}
          </ButtonLink>
          <ButtonLink to="/experience#experiences" variant="outline">
            {t.experience.hero.dining}
          </ButtonLink>
        </div>
      </PageHero>

      <SpacesJourney />
      <ExploreSpace />
      <ExperienceList />
      <TastingStrip />

      <section id="gallery" className="section-y scroll-mt-10 bg-obsidian" aria-labelledby="gallery-page-title">
        <div className="container-x">
          <SectionHeading id="gallery-page-title" eyebrow={t.experience.gallery.eyebrow} lines={renderLines(t.experience.gallery.lines)} />
          <LayoutGroup id="gallery-filter">
            <ul className="mb-10 mt-12 flex flex-wrap gap-x-1 gap-y-2 border-b border-line/15" aria-label={t.experience.gallery.filter}>
              {galleryCategories.map((cat) => (
                <li key={cat}>
                  <button
                    type="button"
                    onClick={() => setFilter(cat)}
                    aria-pressed={filter === cat}
                    className={cn(
                      'relative h-12 px-3 text-[12px] font-medium uppercase tracking-[0.16em] transition-colors',
                      filter === cat ? 'text-champagne' : 'text-fg/60 hover:text-fg',
                    )}
                  >
                    {c.galleryCategory(cat)}
                    {filter === cat && <motion.span layoutId="gallery-underline" className="absolute inset-x-3 -bottom-px h-px bg-champagne" transition={{ duration: 0.5, ease }} />}
                  </button>
                </li>
              ))}
            </ul>
          </LayoutGroup>
          <GalleryGrid key={filter} items={items} />
        </div>
      </section>
    </>
  );
}
