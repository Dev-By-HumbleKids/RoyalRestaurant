import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { menuBySlug } from '@/data/menu';

const META: Record<string, { title: string; description: string }> = {
  '/': {
    title: 'ROYAL — Fire, Time & Grace · Fine Dining since 1928',
    description: 'A fictional international fine-dining house in Yangon: live-fire dry-aged beef, a 3,000-bottle vault and a seven-course Chef’s Counter.',
  },
  '/story': {
    title: 'Our Story — ROYAL',
    description: 'Three generations of the Varenne family and the tamarind-wood hearth that has burned in downtown Yangon since 1928.',
  },
  '/menu': {
    title: 'The Menu — ROYAL',
    description: 'Signature dry-aged steaks, seafood, hand-rolled pasta, desserts and a selection from the Vault.',
  },
  '/experience': {
    title: 'The Experience — ROYAL',
    description: 'The arch and the hearth: explore the rooms of ROYAL, its private dining spaces and the Chef’s Tasting.',
  },
  '/reservations': {
    title: 'Reservations — ROYAL',
    description: 'Reserve a table at ROYAL. Portfolio demo with illustrative availability — no real booking is made.',
  },
  '/reservations/manage': {
    title: 'Manage a Reservation — ROYAL',
    description: 'Find, change or cancel a demo reservation saved in this browser.',
  },
  '/contact': {
    title: 'Contact & Location — ROYAL',
    description: 'Address, opening hours and private-dining inquiries for the fictional ROYAL restaurant.',
  },
  '/credits': { title: 'Photo Credits — ROYAL', description: 'Photography credits for the ROYAL portfolio project.' },
};

/** Per-route document title and description. */
export function usePageMeta() {
  const { pathname } = useLocation();
  useEffect(() => {
    let meta = META[pathname];
    const dish = pathname.startsWith('/menu/') ? menuBySlug.get(pathname.split('/')[2]) : undefined;
    if (dish) meta = { title: `${dish.name} — ROYAL`, description: dish.description };
    meta ??= { title: 'Page not found — ROYAL', description: 'This table doesn’t exist… yet.' };
    document.title = meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', meta.description);
  }, [pathname]);
}
