import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { GalleryGrid } from '@/components/gallery/GalleryGrid';
import { Accolades } from '@/components/home/Accolades';
import { ArchitectureTeaser } from '@/components/home/ArchitectureTeaser';
import { ChefTeaser } from '@/components/home/ChefTeaser';
import { ExperiencesTeaser } from '@/components/home/ExperiencesTeaser';
import { GuestNotes } from '@/components/home/GuestNotes';
import { Hero } from '@/components/home/Hero';
import { Manifesto } from '@/components/home/Manifesto';
import { ReserveCTA } from '@/components/home/ReserveCTA';
import { SignatureShowcase } from '@/components/home/SignatureShowcase';
import { TonightStrip } from '@/components/home/TonightStrip';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { gallery } from '@/data/experiences';
import { Reveal } from '@/motion/Reveal';

const preview = ['i-salon-noir', 's-tomahawk', 'i-chandelier', 'c-plating-2', 'i-vault-wall', 'w-champagne-tower', 'i-candle-table', 'i-bar-warm'].map(
  (k) => gallery.find((g) => g.image === k)!,
);

export default function Home() {
  return (
    <>
      <Hero />
      <TonightStrip />
      <Manifesto />
      <SignatureShowcase />
      <Accolades />
      <ExperiencesTeaser />
      <ArchitectureTeaser />
      <ChefTeaser />
      <GuestNotes />
      <section className="section-y bg-obsidian" aria-labelledby="gallery-title">
        <div className="container-x">
          <div className="mb-14 flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <SectionHeading id="gallery-title" eyebrow="Gallery" lines={['After dark', <em key="e">at ROYAL.</em>]} />
            <Reveal>
              <Link to="/experience#gallery" className="group inline-flex min-h-[44px] items-center gap-3 text-[12px] font-semibold uppercase tracking-[0.2em]">
                <span className="link-underline">The full gallery</span>
                <ArrowUpRight className="h-4 w-4 text-accent" aria-hidden />
              </Link>
            </Reveal>
          </div>
          <GalleryGrid items={preview} />
        </div>
      </section>
      <ReserveCTA />
    </>
  );
}
