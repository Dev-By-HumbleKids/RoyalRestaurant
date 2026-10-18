import { ArrowUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ButtonLink } from '@/components/ui/Button';
import { categories } from '@/data/menu';
import { site } from '@/data/site';
import { Wordmark } from './Wordmark';

export function Footer() {
  const toTop = () => window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });

  return (
    <footer className="relative overflow-hidden border-t border-line/15 bg-obsidian" aria-labelledby="footer-title">
      <div aria-hidden className="deco-fan pointer-events-none absolute -bottom-24 left-1/2 h-[520px] w-[1100px] -translate-x-1/2 opacity-50" />
      <div className="container-x relative pb-10 pt-20 md:pt-28">
        <div className="grid gap-12 border-b border-line/15 pb-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 id="footer-title" className="sr-only">
              ROYAL — visit and contact
            </h2>
            <Wordmark />
            <p className="mt-8 max-w-sm font-display text-[1.9rem] font-light leading-tight text-ivory">
              Fire, time and grace — served nightly beneath the vault since 1928.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <ButtonLink to="/reservations" icon magnetic>
                Reserve a Table
              </ButtonLink>
            </div>
          </div>

          <div className="grid gap-10 sm:grid-cols-3 lg:col-span-7">
            <div>
              <p className="eyebrow mb-5">Explore</p>
              <ul className="space-y-3 text-sm">
                {site.nav.map((n) => (
                  <li key={n.to}>
                    <Link to={n.to} className="link-underline text-fg/80 hover:text-fg">
                      {n.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link to="/reservations/manage" className="link-underline text-fg/80 hover:text-fg">
                    Manage a reservation
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="eyebrow mb-5">The Menu</p>
              <ul className="space-y-3 text-sm">
                {categories.map((c) => (
                  <li key={c.id}>
                    <Link to={`/menu?c=${c.id}`} className="link-underline text-fg/80 hover:text-fg">
                      {c.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="eyebrow mb-5">Visit</p>
              <address className="space-y-1 text-sm not-italic text-fg/80">
                <p>{site.address.line1}</p>
                <p>
                  {site.address.line2}, {site.address.city}
                </p>
                <p className="pt-3">
                  <a href={site.phoneHref} className="link-underline hover:text-fg">
                    {site.phone}
                  </a>
                </p>
                <p>
                  <a href={`mailto:${site.email}`} className="link-underline hover:text-fg">
                    {site.email}
                  </a>
                </p>
              </address>
              <ul className="mt-6 space-y-1 text-sm text-muted">
                <li>Tue – Sun · Dinner from 18:00</li>
                <li>Fri – Sun · Lunch from 12:00</li>
              </ul>
              <ul className="mt-6 flex gap-5 text-[11px] font-semibold uppercase tracking-[0.18em]" aria-label="Social media">
                {site.socials.map((s) => (
                  <li key={s.label}>
                    <a href={s.href} target="_blank" rel="noopener noreferrer" className="link-underline text-fg/70 hover:text-accent">
                      {s.label}
                      <span className="sr-only"> (opens the platform; ROYAL is fictional)</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6 pt-8 text-xs text-muted md:flex-row md:items-center md:justify-between">
          <p className="max-w-2xl leading-relaxed">
            © {new Date().getFullYear()} ROYAL. A fictional restaurant created as a frontend portfolio project. Menus, prices, people,
            awards, reviews and availability are invented demo content — no real reservations are made.{' '}
            <Link to="/credits" className="link-underline text-fg/70">
              Photo credits
            </Link>
          </p>
          <button
            type="button"
            onClick={toTop}
            className="group inline-flex min-h-[44px] items-center gap-3 self-start text-[11px] font-semibold uppercase tracking-[0.2em] text-fg/80 hover:text-accent md:self-auto"
          >
            Back to top
            <span className="grid h-10 w-10 place-items-center rounded-full border border-line/30 transition-colors group-hover:border-accent">
              <ArrowUp className="h-4 w-4 transition-transform duration-500 ease-luxe group-hover:-translate-y-0.5" aria-hidden />
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
}
