import { imageAlts, type ImageKey } from '@/data/images';
import imageWidths from '@/data/imageWidths.json';

export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}

const BASE = import.meta.env.BASE_URL;

const VARIANTS = ['sm', 'lg', 'xl'] as const;

/**
 * Responsive sources from the real pixel widths recorded by scripts/fetch-images.mjs, so the browser never
 * picks a file that is narrower than it was promised. Landscape photos also have an `xl` (up to 2560px).
 */
export function imageSources(key: ImageKey) {
  const { w, r } = (imageWidths as Record<string, { w: number[]; r: number }>)[key] ?? { w: [800, 1600], r: 1.5 };
  return {
    src: `${BASE}images/${key}-lg.webp`,
    srcSet: w.map((width, i) => `${BASE}images/${key}-${VARIANTS[i]}.webp ${width}w`).join(', '),
    alt: imageAlts[key],
    /** Width ÷ height of the photo. */
    ratio: r,
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
