import { format, parseISO } from 'date-fns';
import { useMemo } from 'react';
import { experiences, gallery, tastingCourses } from '@/data/experiences';
import { categories, menu } from '@/data/menu';
import { site } from '@/data/site';
import { spaces } from '@/data/spaces';
import { accolades, chef, pillars, sourcing, team, techniques, testimonials, timeline } from '@/data/story';
import { areaMeta } from '@/data/tables';
import type { Allergen, DiningArea, MenuCategory, MenuItem } from '@/types';
import {
  allergenMy,
  areaMy,
  categoriesMy,
  dietaryMy,
  experiencesMy,
  galleryCaptionMy,
  menuMy,
  siteMy,
  spacesMy,
  storyMy,
  tastingMy,
  wineStyleMy,
} from './content-my';
import { en, type Dict } from './en';
import { my } from './my';
import { useLang, type Lang } from './store';

export { useLang, type Lang };

const DICTS: Record<Lang, Dict> = { en, my };

const dietaryEn: Record<string, string> = {
  vegetarian: 'Vegetarian',
  'gluten-free': 'Gluten-free',
  'dairy-free': 'Dairy-free',
  'contains-nuts': 'Contains nuts',
};

// ——— content, localised once per language ———
// Titles, names, eyebrows and labels stay in English in both languages (see KEEP_ENGLISH in my.ts);
// only descriptive copy is translated.
function buildContent(lang: Lang) {
  const isMy = lang === 'my';
  const localMenu: MenuItem[] = isMy
    ? menu.map((item) => {
        const tr = menuMy[item.id];
        if (!tr) return item;
        return {
          ...item,
          description: tr.description,
          story: tr.story ?? item.story,
          priceNote: tr.priceNote ?? item.priceNote,
          wine: item.wine ? { ...item.wine, notes: tr.notes ?? item.wine.notes } : undefined,
        };
      })
    : menu;

  return {
    site: isMy ? { ...site, ...siteMy } : site,
    categories: categories.map((c) => (isMy ? { ...c, intro: categoriesMy[c.id]?.intro ?? c.intro } : c)),
    menu: localMenu,
    menuById: new Map(localMenu.map((m) => [m.id, m])),
    menuBySlug: new Map(localMenu.map((m) => [m.slug, m])),
    categoryLabel: (id: MenuCategory) => categories.find((c) => c.id === id)?.label ?? id,
    dietaryLabel: (d: string) => (isMy ? dietaryMy[d] : dietaryEn[d]) ?? d,
    allergenLabel: (a: Allergen) => (isMy ? allergenMy[a] : a) ?? a,
    wineStyle: (s: string) => (isMy ? wineStyleMy[s] : s) ?? s,
    timeline: timeline.map((m, i) => (isMy ? { ...m, body: storyMy.timeline[i].body } : m)),
    pillars: pillars.map((p, i) => (isMy ? { ...p, body: storyMy.pillars[i].body } : p)),
    sourcing: sourcing.map((s, i) => (isMy ? { ...s, body: storyMy.sourcing[i].body } : s)),
    techniques: techniques.map((x, i) => (isMy ? { ...x, detail: storyMy.techniques[i].detail } : x)),
    chef: isMy ? { ...chef, bio: storyMy.chef.bio, philosophy: storyMy.chef.philosophy, specialties: storyMy.chef.specialties } : chef,
    team: team.map((m) => (isMy ? { ...m, bio: storyMy.team[m.name].bio, specialties: storyMy.team[m.name].specialties } : m)),
    testimonials: testimonials.map((t, i) => (isMy ? { ...t, quote: storyMy.testimonials[i].quote } : t)),
    accolades,
    spaces: spaces.map((s) => {
      const tr = isMy ? spacesMy[s.id] : undefined;
      return tr ? { ...s, body: tr.body, materials: tr.materials, capacity: tr.capacity ?? s.capacity } : s;
    }),
    experiences: experiences.map((e) => {
      if (!isMy) return e;
      const tr = experiencesMy[e.id];
      return { ...e, body: tr.body, price: tr.price, duration: tr.duration, party: tr.party, action: { ...e.action, label: tr.action } };
    }),
    tastingCourses: tastingCourses.map((c) => (isMy ? { ...c, detail: tastingMy[c.n] ?? c.detail } : c)),
    gallery: gallery.map((g) => (isMy ? { ...g, caption: galleryCaptionMy[g.image] ?? g.caption } : g)),
    galleryCategory: (c: string) => c,
    area: (a: DiningArea) => (isMy ? { ...areaMeta[a], description: areaMy[a].description } : areaMeta[a]),
    address: () => {
      const a = isMy ? siteMy.address : site.address;
      return `${a.line1}, ${a.city}`;
    },
  };
}

export type Content = ReturnType<typeof buildContent>;
const CONTENT: Partial<Record<Lang, Content>> = {};
const contentFor = (lang: Lang) => (CONTENT[lang] ??= buildContent(lang));

// ——— formatting ———
type DateLike = Date | string;
const toDate = (d: DateLike) => (typeof d === 'string' ? parseISO(d) : d);

/** Burmese month and weekday names with Latin digits, so dates match prices and times. */
const myFmt = (opts: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat('my-MM-u-nu-latn', opts);

function buildFormat(lang: Lang) {
  const isMy = lang === 'my';
  return {
    price: (value: number) => {
      const n = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value);
      return isMy ? `${n} ကျပ်` : `Ks ${n}`;
    },
    /** "October 2026" */
    monthYear: (d: DateLike) => (isMy ? myFmt({ month: 'long', year: 'numeric' }).format(toDate(d)) : format(toDate(d), 'MMMM yyyy')),
    /** "Tuesday 20 October" */
    weekdayDayMonth: (d: DateLike) =>
      isMy ? myFmt({ weekday: 'long', day: 'numeric', month: 'long' }).format(toDate(d)) : format(toDate(d), 'EEEE d MMMM'),
    /** "Tuesday 20 October 2026" */
    longDate: (d: DateLike) =>
      isMy ? myFmt({ weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(toDate(d)) : format(toDate(d), 'EEEE d MMMM yyyy'),
    /** "Tue 20 October" */
    shortWeekdayMonth: (d: DateLike) =>
      isMy ? myFmt({ weekday: 'short', day: 'numeric', month: 'long' }).format(toDate(d)) : format(toDate(d), 'EEE d MMMM'),
    /** "Tue 20 Oct 2026" */
    shortDate: (d: DateLike) =>
      isMy ? myFmt({ weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }).format(toDate(d)) : format(toDate(d), 'EEE d MMM yyyy'),
    /** "Tue 20 Oct" */
    shortDateNoYear: (d: DateLike) =>
      isMy ? myFmt({ weekday: 'short', day: 'numeric', month: 'short' }).format(toDate(d)) : format(toDate(d), 'EEE d MMM'),
  };
}

export type Format = ReturnType<typeof buildFormat>;
const FORMATS: Partial<Record<Lang, Format>> = {};
const formatFor = (lang: Lang) => (FORMATS[lang] ??= buildFormat(lang));

/** One hook for everything language-dependent: `t` (UI strings), `c` (content), `fmt` (prices and dates). */
export function useI18n() {
  const lang = useLang((s) => s.lang);
  return useMemo(() => ({ lang, t: DICTS[lang], c: contentFor(lang), fmt: formatFor(lang) }), [lang]);
}

/** For non-React modules (e.g. page meta) that need the current dictionary. */
export const dictFor = (lang: Lang) => DICTS[lang];

export { renderLines } from './renderLines';

/** Human text for anything thrown by the reservation service (codes) or an unexpected error. */
export function errorText(t: Dict, err: unknown): string {
  const code = (err as { code?: string } | null)?.code;
  if (code && code in t.errors) return t.errors[code as keyof Dict['errors']];
  if (code && code in t.reasons) return t.reasons[code as keyof Dict['reasons']];
  return t.errors.unexpected;
}
