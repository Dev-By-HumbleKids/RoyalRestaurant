import { ButtonLink } from '@/components/ui/Button';
import { ParallaxImage } from '@/components/ui/ParallaxImage';
import { renderLines, useI18n } from '@/i18n';
import { Reveal, RevealLines } from '@/motion/Reveal';

export function ReserveCTA() {
  const { t } = useI18n();
  return (
    <section className="relative overflow-hidden bg-obsidian" aria-labelledby="cta-title">
      <div className="absolute inset-0">
        <ParallaxImage k="i-candle-table" reveal={false} strength={8} className="h-full w-full" imgClassName="opacity-50" sizes="100vw" />
      </div>
      <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-obsidian via-obsidian/40 to-obsidian" />
      <div className="container-x relative flex min-h-[80svh] flex-col items-center justify-center py-28 text-center">
        <Reveal>
          <p className="eyebrow mb-8">{t.home.cta.eyebrow}</p>
        </Reveal>
        <RevealLines id="cta-title" lines={renderLines(t.home.cta.lines)} className="display-xl text-ivory" />
        <Reveal delay={0.2}>
          <p className="lede mx-auto mt-8 max-w-md">
            {t.home.cta.lede}
          </p>
        </Reveal>
        <Reveal delay={0.3} className="mt-12 flex flex-wrap justify-center gap-4">
          <ButtonLink to="/reservations" icon magnetic>
            {t.common.reserveTable}
          </ButtonLink>
          <ButtonLink to="/contact#private-dining" variant="outline" magnetic>
            {t.home.cta.inquiry}
          </ButtonLink>
        </Reveal>
      </div>
    </section>
  );
}
