// Downloads the curated Unsplash photos listed in scripts/images.tsv as WebP in up to three widths
// (`-sm` / `-lg` / `-xl`), records each file's real pixel widths and aspect ratio in src/data/imageWidths.json
// (so srcset never claims more pixels than a file has) and writes CREDITS.md.
// Usage: node scripts/fetch-images.mjs          (skips files that already exist)
//        node scripts/fetch-images.mjs --force     (re-downloads everything)
//        node scripts/fetch-images.mjs --force-xl  (re-downloads only the xl files)
import { existsSync, mkdirSync, readFileSync, statSync, unlinkSync, writeFileSync } from 'node:fs';

const OUT = 'public/images';
const FORCE = process.argv.includes('--force');
// Re-download only the xl files (e.g. after changing their quality).
const FORCE_XL = FORCE || process.argv.includes('--force-xl');
mkdirSync(OUT, { recursive: true });

// A 4th column `wide` marks a portrait photo that the site shows as a full-width background: its xl is a
// centred 16:9 crop, which object-cover would show anyway, instead of an impossibly tall portrait.
const rows = readFileSync('scripts/images.tsv', 'utf8')
  .split(/\r?\n/)
  .filter(Boolean)
  .map((line) => {
    const [key, id, slug, flag] = line.split('\t');
    return { key, id, slug, wide: flag === 'wide' };
  });

// Width is what srcset selects on, so sizes are limited by width. The height cap only stops tall
// portraits from becoming enormous files. xl is only picked on large or high-density screens, where
// slightly stronger compression is invisible, so it uses a lower quality.
const VARIANTS = {
  sm: { w: 800, h: 1100, q: 70 },
  lg: { w: 1600, h: 1800, q: 70 },
  xl: { w: 2560, h: 2200, q: 60 },
};

const url = (id, { w, h, q }, crop = false) =>
  `https://images.unsplash.com/${id}?w=${w}&h=${h}&q=${q}&fm=webp&fit=${crop ? 'crop&crop=center' : 'max'}`;

/** Pixel size of a WebP file (VP8, VP8L or VP8X). */
function webpSize(file) {
  const b = readFileSync(file);
  const fourcc = b.toString('ascii', 12, 16);
  if (fourcc === 'VP8X') return [1 + b.readUIntLE(24, 3), 1 + b.readUIntLE(27, 3)];
  if (fourcc === 'VP8 ') return [b.readUInt16LE(26) & 0x3fff, b.readUInt16LE(28) & 0x3fff];
  if (fourcc === 'VP8L') {
    const n = b.readUInt32LE(21);
    return [1 + (n & 0x3fff), 1 + ((n >> 14) & 0x3fff)];
  }
  throw new Error(`Not a WebP file: ${file}`);
}

async function download(src, file, force) {
  if (!force && existsSync(file) && statSync(file).size > 0) return;
  const res = await fetch(src);
  if (!res.ok) throw new Error(`${res.status} ${src}`);
  writeFileSync(file, Buffer.from(await res.arrayBuffer()));
}

const widths = {};
let failed = 0;
for (const { key, id, wide } of rows) {
  try {
    const xlFile = `${OUT}/${key}-xl.webp`;
    // Without a force flag, a photo that already has sm/lg but no xl had its xl dropped on purpose (see below).
    const xlDropped = !FORCE_XL && existsSync(`${OUT}/${key}-lg.webp`) && !existsSync(xlFile);
    await download(url(id, VARIANTS.sm), `${OUT}/${key}-sm.webp`, FORCE);
    await download(url(id, VARIANTS.lg), `${OUT}/${key}-lg.webp`, FORCE);
    if (!xlDropped) await download(wide ? url(id, { ...VARIANTS.xl, h: 1440 }, true) : url(id, VARIANTS.xl), xlFile, FORCE_XL);
    const [sm] = webpSize(`${OUT}/${key}-sm.webp`);
    const [lg, lgH] = webpSize(`${OUT}/${key}-lg.webp`);
    const [xl, xlH] = xlDropped ? [0, 0] : webpSize(xlFile);
    // Only landscape photos are ever shown wider than lg (full-bleed heroes, the gallery lightbox). An xl for a
    // portrait or square photo, or one barely wider than lg, would only cost bandwidth.
    const keepXl = wide || (xl > xlH * 1.05 && xl >= lg * 1.2);
    if (!keepXl && existsSync(xlFile)) unlinkSync(xlFile);
    widths[key] = { w: keepXl ? [sm, lg, xl] : [sm, lg], r: Math.round((lg / lgH) * 1000) / 1000 };
  } catch (err) {
    failed++;
    console.error('FAILED', key, err.message);
  }
}

const lines = Object.entries(widths).map(([key, w]) => `  ${JSON.stringify(key)}: ${JSON.stringify(w)}`);
writeFileSync('src/data/imageWidths.json', `{\n${lines.join(',\n')}\n}\n`);

const credits = [
  '# Image Credits',
  '',
  'All photographs are from [Unsplash](https://unsplash.com) and used under the',
  '[Unsplash License](https://unsplash.com/license). They are illustrative only: ROYAL is a fictional restaurant',
  'and none of the pictured places, dishes or people are affiliated with it.',
  '',
  '| Asset | Source |',
  '|---|---|',
  ...rows.map(({ key, slug }) => `| \`${key}\` | https://unsplash.com/photos/${slug} |`),
  '',
];
writeFileSync('CREDITS.md', credits.join('\n'));

console.log(`Done. ${rows.length} photos, ${failed} failures.`);
