import { ButtonLink } from '@/components/ui/Button';
import { ParallaxImage } from '@/components/ui/ParallaxImage';
import { Reveal, RevealLines } from '@/motion/Reveal';

export function ReserveCTA() {
  return (
    <section className="relative overflow-hidden bg-obsidian" aria-labelledby="cta-title">
      <div className="absolute inset-0">
        <ParallaxImage k="i-candle-table" reveal={false} strength={8} className="h-full w-full" imgClassName="opacity-50" sizes="100vw" />
      </div>
      <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-obsidian via-obsidian/40 to-obsidian" />
      <div className="container-x relative flex min-h-[80svh] flex-col items-center justify-center py-28 text-center">
        <Reveal>
          <p className="eyebrow mb-8">Tuesday to Sunday · from 18:00</p>
        </Reveal>
        <RevealLines id="cta-title" lines={['Your table', <em key="e">is waiting.</em>]} className="display-xl text-ivory" />
        <Reveal delay={0.2}>
          <p className="lede mx-auto mt-8 max-w-md">
            Reserve up to sixty days ahead. For nine guests or more, Salon Noir and the Cellar Room can be arranged by inquiry.
          </p>
        </Reveal>
        <Reveal delay={0.3} className="mt-12 flex flex-wrap justify-center gap-4">
          <ButtonLink to="/reservations" icon magnetic>
            Reserve a Table
          </ButtonLink>
          <ButtonLink to="/contact#private-dining" variant="outline" magnetic>
            Private dining inquiry
          </ButtonLink>
        </Reveal>
      </div>
    </section>
  );
}
