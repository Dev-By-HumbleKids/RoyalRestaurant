import { imageAlts, type ImageKey } from '@/data/images';

export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}

const BASE = import.meta.env.BASE_URL;

/** Wide editorial assets are exported at 800/1600px, plated food at 640/1100px. */
function widths(key: ImageKey): [number, number] {
  return /^(i|f|p|c|w)-/.test(key) ? [800, 1600] : [640, 1100];
}

export function imageSources(key: ImageKey) {
  const [sm, lg] = widths(key);
  return {
    src: `${BASE}images/${key}-lg.webp`,
    srcSet: `${BASE}images/${key}-sm.webp ${sm}w, ${BASE}images/${key}-lg.webp ${lg}w`,
    alt: imageAlts[key],
  };
}

/** Myanmar kyat, written the way Yangon menus print it: "Ks 445,000". */
export const kyat = (value: number) => `Ks ${new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value)}`;

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const pad2 = (n: number) => String(n).padStart(2, '0');

/** "demo.guest@example.com" → "de••••••••@example.com" — never show full contact details in the UI. */
export function maskEmail(email: string) {
  const [user, domain] = email.split('@');
  return `${user.slice(0, 2)}${'•'.repeat(Math.max(1, user.length - 2))}@${domain}`;
}
