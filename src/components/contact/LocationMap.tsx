import { ExternalLink } from 'lucide-react';
import { site } from '@/data/site';
import { useI18n } from '@/i18n';

/**
 * Google Maps embed of Kannar Road, Kyimyindaing (no API key needed). The street is real; ROYAL is fictional.
 * The map is tinted dark to sit inside the site's palette, and only loads when scrolled near.
 */
export function LocationMap() {
  const { t, lang } = useI18n();
  const m = t.contact.map;
  const q = `${site.geo.lat},${site.geo.lng}`;
  const src = `https://maps.google.com/maps?q=${q}&z=16&hl=${lang === 'my' ? 'my' : 'en'}&output=embed`;
  const link = `https://www.google.com/maps/search/?api=1&query=${q}`;

  return (
    <figure className="border border-line/20 bg-[#15120F]">
      <div className="relative aspect-[4/3] overflow-hidden lg:aspect-[6/5]">
        <iframe
          key={lang}
          src={src}
          title={m.title}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0 [filter:invert(0.9)_hue-rotate(180deg)_saturate(0.55)_brightness(0.95)]"
        />
        <div aria-hidden className="pointer-events-none absolute inset-0 shadow-[inset_0_0_60px_rgba(17,17,15,0.65)]" />
      </div>
      <figcaption className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-[11px] uppercase tracking-[0.16em] text-muted">
        <span>{m.caption}</span>
        <a href={link} target="_blank" rel="noopener noreferrer" className="link-underline inline-flex min-h-[44px] items-center gap-2 text-accent">
          {m.open}
          <ExternalLink className="h-3.5 w-3.5" aria-hidden />
        </a>
      </figcaption>
    </figure>
  );
}
