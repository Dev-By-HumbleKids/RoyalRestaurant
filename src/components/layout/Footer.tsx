import { ArrowUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ButtonLink } from '@/components/ui/Button';
import { site } from '@/data/site';
import { useI18n } from '@/i18n';
import { Wordmark } from './Wordmark';

export function Footer() {
  const { t, c } = useI18n();
  const toTop = () => window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });

  return (
    <footer className="relative overflow-hidden border-t border-line/15 bg-obsidian" aria-labelledby="footer-title">
      <div aria-hidden className="deco-fan pointer-events-none absolute -bottom-24 left-1/2 h-[520px] w-[1100px] -translate-x-1/2 opacity-50" />
      <div className="container-x relative pb-10 pt-20 md:pt-28">
        <div className="grid grid-cols-1 gap-12 border-b border-line/15 pb-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 id="footer-title" className="sr-only">
              {t.footer.title}
            </h2>
            <Wordmark />
            <p className="mt-8 max-w-sm font-display text-[1.9rem] font-light leading-tight text-ivory">
              {t.footer.statement}
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <ButtonLink to="/reservations" icon magnetic>
                {t.common.reserveTable}
              </ButtonLink>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-10 sm:grid-cols-3 lg:col-span-7">
            <div>
              <p className="eyebrow mb-5">{t.footer.explore}</p>
              <ul className="space-y-3 text-sm [@media(pointer:coarse)]:space-y-6">
                {site.nav.map((n) => (
                  <li key={n.to}>
                    <Link to={n.to} className="link-underline tap-target text-fg/80 hover:text-fg">
                      {t.nav[n.to]}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link to="/reservations/manage" className="link-underline tap-target text-fg/80 hover:text-fg">
                    {t.footer.manage}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="eyebrow mb-5">{t.footer.theMenu}</p>
              <ul className="space-y-3 text-sm [@media(pointer:coarse)]:space-y-6">
                {c.categories.map((cat) => (
                  <li key={cat.id}>
                    <Link to={`/menu?c=${cat.id}`} className="link-underline tap-target text-fg/80 hover:text-fg">
                      {cat.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="eyebrow mb-5">{t.footer.visit}</p>
              <address className="space-y-1 text-sm not-italic text-fg/80">
                <p>{c.site.address.line1}</p>
                <p>
                  {c.site.address.line2}, {c.site.address.city}
                </p>
                <p className="pt-3 [@media(pointer:coarse)]:py-3">
                  <a href={site.phoneHref} className="link-underline tap-target hover:text-fg">
                    {site.phone}
                  </a>
                </p>
                <p className="[@media(pointer:coarse)]:py-3">
                  <a href={`mailto:${site.email}`} className="link-underline tap-target break-all hover:text-fg">
                    {site.email}
                  </a>
                </p>
              </address>
              <ul className="mt-6 space-y-1 text-sm text-muted">
                <li>{t.footer.dinner}</li>
                <li>{t.footer.lunch}</li>
              </ul>
              <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-4 text-[11px] font-semibold uppercase tracking-[0.18em]" aria-label={t.footer.social}>
                {site.socials.map((s) => (
                  <li key={s.label}>
                    <a href={s.href} target="_blank" rel="noopener noreferrer" className="link-underline tap-target text-fg/70 hover:text-accent">
                      {s.label}
                      <span className="sr-only">{t.footer.socialSr}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6 pt-8 text-xs text-muted md:flex-row md:items-center md:justify-between">
          <p className="max-w-2xl leading-relaxed">
            {t.footer.copyright(new Date().getFullYear())}{' '}
            <Link to="/credits" className="link-underline tap-target text-fg/70">
              {t.footer.credits}
            </Link>
            <span className="mt-3 block [@media(pointer:coarse)]:mt-5">
              {t.footer.builtBy}{' '}
              <a href={site.developer.url} target="_blank" rel="noopener noreferrer" className="link-underline tap-target text-accent">
                {site.developer.name}
              </a>
            </span>
          </p>
          <button
            type="button"
            onClick={toTop}
            className="group inline-flex min-h-[44px] items-center gap-3 self-start text-[11px] font-semibold uppercase tracking-[0.2em] text-fg/80 hover:text-accent md:self-auto"
          >
            {t.footer.backToTop}
            <span className="grid h-10 w-10 place-items-center rounded-full border border-line/30 transition-colors group-hover:border-accent">
              <ArrowUp className="h-4 w-4 transition-transform duration-500 ease-luxe group-hover:-translate-y-0.5" aria-hidden />
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
}
