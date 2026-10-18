import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useI18n } from '@/i18n';

/** Per-route document title and description, plus the page language for fonts, hyphenation and screen readers. */
export function usePageMeta() {
  const { pathname } = useLocation();
  const { lang, t, c } = useI18n();

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    let meta = t.meta[pathname];
    const dish = pathname.startsWith('/menu/') ? c.menuBySlug.get(pathname.split('/')[2]) : undefined;
    if (dish) meta = { title: `${dish.name} — ROYAL`, description: dish.description };
    meta ??= t.meta.notFound;
    document.title = meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', meta.description);
  }, [pathname, t, c]);
}
