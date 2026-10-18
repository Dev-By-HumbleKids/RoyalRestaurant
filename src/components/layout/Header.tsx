import { motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ButtonLink } from '@/components/ui/Button';
import { site } from '@/data/site';
import { cn } from '@/lib/utils';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { useI18n } from '@/i18n';
import { ease } from '@/motion/tokens';
import { useWishlist } from '@/store/wishlistStore';
import { LanguageSwitch } from './LanguageSwitch';
import { MobileMenu } from './MobileMenu';
import { Wordmark } from './Wordmark';

export function Header() {
  const { pathname } = useLocation();
  const { t } = useI18n();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const wishCount = useWishlist((s) => s.ids.length);
  const openWishlist = useWishlist((s) => s.setOpen);
  const wrapRef = useRef<HTMLDivElement>(null);
  // Header + menu panel form one focus scope while the menu is open, so the close toggle stays reachable.
  useFocusTrap(wrapRef, menuOpen, () => setMenuOpen(false));

  useMotionValueEvent(scrollY, 'change', (y) => {
    const previous = scrollY.getPrevious() ?? 0;
    setScrolled(y > 40);
    setHidden(y > previous && y > 520);
  });

  useEffect(() => {
    setMenuOpen(false);
    setHidden(false);
  }, [pathname]);

  return (
    <div ref={wrapRef}>
      <a
        href="#main"
        className="fixed left-4 top-3 z-[100] -translate-y-24 bg-champagne px-4 py-3 text-sm font-semibold text-obsidian transition-transform focus:translate-y-0"
      >
        {t.header.skip}
      </a>
      <motion.header
        className="fixed inset-x-0 top-0 z-50"
        animate={{ y: hidden && !menuOpen ? '-100%' : '0%' }}
        transition={{ duration: 0.6, ease }}
      >
        <div
          aria-hidden
          className={cn(
            'absolute inset-0 transition-[background-color,border-color,opacity] duration-700 ease-luxe',
            scrolled ? 'border-b border-line/15 bg-obsidian/95' : 'border-b border-transparent bg-gradient-to-b from-obsidian/75 via-obsidian/25 to-transparent',
          )}
        />
        <div className="container-x relative flex h-[68px] items-center justify-between gap-3 sm:h-[76px] sm:gap-6">
          <Link to="/" aria-label={t.header.home} className="flex h-11 min-w-[44px] shrink-0 items-center">
            <Wordmark collapse />
          </Link>

          <nav aria-label={t.header.primary} className="hidden xl:block">
            <ul className="flex items-center gap-9">
              {site.nav.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.to === '/'}
                    className={({ isActive }) =>
                      cn(
                        'link-underline relative py-2 text-[12px] font-medium uppercase tracking-[0.2em] transition-colors duration-300',
                        isActive ? 'text-accent' : 'text-fg/80 hover:text-fg',
                      )
                    }
                  >
                    {t.nav[item.to]}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
            <LanguageSwitch />
            {wishCount > 0 && (
              <button
                type="button"
                onClick={() => openWishlist(true)}
                className="hidden h-11 items-center gap-2 px-3 text-[12px] font-medium uppercase tracking-[0.18em] text-fg/80 transition-colors hover:text-accent md:inline-flex"
              >
                {t.header.myEvening}
                <span className="grid h-6 min-w-6 place-items-center rounded-full bg-champagne px-1.5 text-[11px] font-semibold text-obsidian tabular">
                  {wishCount}
                </span>
              </button>
            )}
            <ButtonLink to="/reservations" className="hidden !min-h-[44px] !px-5 sm:inline-flex">
              {t.common.reserveTable}
            </ButtonLink>
            <button
              type="button"
              className="group grid h-11 w-11 place-items-center xl:hidden"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? t.header.closeMenu : t.header.openMenu}
              onClick={() => setMenuOpen((v) => !v)}
            >
              <span className="relative block h-3 w-7" aria-hidden>
                <span
                  className={cn(
                    'absolute left-0 top-0 h-px w-full bg-fg transition-transform duration-500 ease-luxe',
                    menuOpen && 'translate-y-1.5 rotate-45',
                  )}
                />
                <span
                  className={cn(
                    'absolute bottom-0 right-0 h-px bg-fg transition-all duration-500 ease-luxe',
                    menuOpen ? 'w-full -translate-y-1.5 -rotate-45' : 'w-4 group-hover:w-full',
                  )}
                />
              </span>
            </button>
          </div>
        </div>
      </motion.header>
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </div>
  );
}
