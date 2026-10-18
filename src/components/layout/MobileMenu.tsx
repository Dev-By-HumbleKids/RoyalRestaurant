import { AnimatePresence, motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { ButtonLink } from '@/components/ui/Button';
import { site } from '@/data/site';
import { useI18n } from '@/i18n';
import { cn } from '@/lib/utils';
import { ease, easeInOut } from '@/motion/tokens';
import { useWishlist } from '@/store/wishlistStore';

export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  return <AnimatePresence>{open && <Panel onClose={onClose} />}</AnimatePresence>;
}

/** Focus trap, Escape and scroll lock are handled by Header, which wraps both the bar and this panel. */
function Panel({ onClose }: { onClose: () => void }) {
  const wishCount = useWishlist((s) => s.ids.length);
  const { t, c } = useI18n();
  const openWishlist = useWishlist((s) => s.setOpen);

  return (
    <motion.div
      id="mobile-menu"
      className="fixed inset-0 z-40 flex flex-col overflow-y-auto bg-espresso pt-[76px]"
      initial={{ clipPath: 'inset(0 0 100% 0)' }}
      animate={{ clipPath: 'inset(0 0 0% 0)' }}
      exit={{ clipPath: 'inset(0 0 100% 0)' }}
      transition={{ duration: 0.75, ease: easeInOut }}
      aria-label={t.mobileMenu.aria}
      role="dialog"
      aria-modal="true"
    >
      <div aria-hidden className="deco-fan pointer-events-none absolute inset-x-0 bottom-0 h-[60vh] opacity-60" />
      <nav aria-label={t.mobileMenu.nav} className="container-x relative flex-1 py-10">
        <ul className="space-y-1">
          {site.nav.map((item, i) => (
            <li key={item.to} className="overflow-hidden">
              <motion.div
                initial={{ y: '110%' }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, ease, delay: 0.25 + i * 0.05 }}
              >
                <NavLink
                  to={item.to}
                  end={item.to === '/'}
                  data-autofocus={i === 0 ? true : undefined}
                  onClick={onClose}
                  className={({ isActive }) =>
                    cn(
                      'flex items-baseline gap-5 py-2 font-display text-[clamp(2.4rem,9vw,4rem)] font-light leading-none transition-colors',
                      isActive ? 'text-accent' : 'text-ivory hover:text-accent',
                    )
                  }
                >
                  <span className="w-8 font-sans text-xs tracking-[0.2em] text-muted tabular">0{i + 1}</span>
                  {t.nav[item.to]}
                </NavLink>
              </motion.div>
            </li>
          ))}
        </ul>
      </nav>
      <motion.div
        className="container-x relative grid gap-6 border-t border-line/15 py-8 sm:grid-cols-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        <div className="text-sm text-muted">
          <p className="eyebrow mb-3">{t.mobileMenu.visit}</p>
          <p>
            {c.site.address.line1}, {c.site.address.line2}
            <br />
            {c.site.address.city} · {t.mobileMenu.days}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 sm:justify-end">
          {wishCount > 0 && (
            <button
              type="button"
              className="min-h-[48px] border border-line/30 px-5 text-[12px] font-semibold uppercase tracking-[0.2em] text-ivory"
              onClick={() => {
                onClose();
                openWishlist(true);
              }}
            >
              {t.mobileMenu.myEvening(wishCount)}
            </button>
          )}
          <ButtonLink to="/reservations" onClick={onClose} icon>
            {t.common.reserveTable}
          </ButtonLink>
        </div>
      </motion.div>
    </motion.div>
  );
}
