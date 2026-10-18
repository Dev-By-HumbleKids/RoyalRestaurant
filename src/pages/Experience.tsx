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
import { gallery, galleryCategories, type GalleryCategory } from '@/data/experiences';
import { cn } from '@/lib/utils';
import { ease } from '@/motion/tokens';

export default function Experience() {
  const [filter, setFilter] = useState<GalleryCategory>('All');
  const items = filter === 'All' ? gallery : gallery.filter((g) => g.category === filter);

  return (
    <>
      <PageHero
        image="i-arch-facade"
        eyebrow="The experience"
        lines={['The Arch', <em key="e">& the Hearth.</em>]}
        lede="A 1926 bank hall in downtown Yangon, rebuilt around a fire that has burned since 1928. Eight rooms, one standard of hospitality."
      >
        <div className="flex flex-wrap gap-4">
          <ButtonLink to="/experience#explore" icon>
            Explore the space
          </ButtonLink>
          <ButtonLink to="/experience#experiences" variant="outline">
            Dining experiences
          </ButtonLink>
        </div>
      </PageHero>

      <SpacesJourney />
      <ExploreSpace />
      <ExperienceList />
      <TastingStrip />

      <section id="gallery" className="section-y scroll-mt-10 bg-obsidian" aria-labelledby="gallery-page-title">
        <div className="container-x">
          <SectionHeading id="gallery-page-title" eyebrow="Gallery" lines={['Light, stone,', <em key="e">fire and wine.</em>]} />
          <LayoutGroup id="gallery-filter">
            <ul className="mb-10 mt-12 flex flex-wrap gap-x-1 gap-y-2 border-b border-line/15" aria-label="Filter gallery">
              {galleryCategories.map((c) => (
                <li key={c}>
                  <button
                    type="button"
                    onClick={() => setFilter(c)}
                    aria-pressed={filter === c}
                    className={cn(
                      'relative h-12 px-3 text-[12px] font-medium uppercase tracking-[0.16em] transition-colors',
                      filter === c ? 'text-champagne' : 'text-fg/60 hover:text-fg',
                    )}
                  >
                    {c}
                    {filter === c && <motion.span layoutId="gallery-underline" className="absolute inset-x-3 -bottom-px h-px bg-champagne" transition={{ duration: 0.5, ease }} />}
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
