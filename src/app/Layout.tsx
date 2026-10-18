import { AnimatePresence } from 'framer-motion';
import { Suspense, useEffect, useRef, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { Cursor } from '@/components/layout/Cursor';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { Intro } from '@/components/layout/Intro';
import { PageTransition } from '@/components/layout/PageTransition';
import { WishlistDrawer } from '@/components/menu/WishlistDrawer';
import { Toaster } from '@/components/ui/Toast';

/** Routes that should not re-trigger the page transition (e.g. opening a dish modal on /menu). */
function transitionKey(pathname: string) {
  if (pathname.startsWith('/menu')) return '/menu';
  return pathname;
}

function scrollToHash(hash: string) {
  const el = document.getElementById(decodeURIComponent(hash.slice(1)));
  if (!el) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
}

export function Layout({ children }: { children: (location: ReturnType<typeof useLocation>) => ReactNode }) {
  const location = useLocation();
  // null on first load: the lazy page has not rendered yet, so wait like a route change.
  const previousPath = useRef<string | null>(null);

  useEffect(() => {
    const samePage = previousPath.current === location.pathname;
    previousPath.current = location.pathname;
    if (!location.hash) return;
    // Wait for the page transition when arriving from another route; jump immediately on the same page.
    const t = setTimeout(() => scrollToHash(location.hash), samePage ? 0 : 650);
    return () => clearTimeout(t);
  }, [location.hash, location.pathname, location.key]);

  return (
    <>
      <Intro />
      <Header />
      <main id="main" tabIndex={-1} className="outline-none">
        <AnimatePresence mode="wait" initial={false} onExitComplete={() => window.scrollTo(0, 0)}>
          <PageTransition key={transitionKey(location.pathname)}>
            <Suspense fallback={<div className="min-h-[100svh] bg-obsidian" />}>{children(location)}</Suspense>
          </PageTransition>
        </AnimatePresence>
      </main>
      <Footer />
      <WishlistDrawer />
      <Toaster />
      <Cursor />
      <div className="grain" aria-hidden />
    </>
  );
}
