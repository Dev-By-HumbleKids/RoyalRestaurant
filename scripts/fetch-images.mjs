// Downloads the curated Unsplash photos listed in scripts/images.tsv as optimized WebP in two widths
// (`-sm` / `-lg`) and writes CREDITS.md. Safe to re-run: existing files are skipped.
// Usage: node scripts/fetch-images.mjs
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';

const OUT = 'public/images';
mkdirSync(OUT, { recursive: true });

const rows = readFileSync('scripts/images.tsv', 'utf8')
  .split(/\r?\n/)
  .filter(Boolean)
  .map((line) => {
    const [key, id, slug] = line.split('\t');
    return { key, id, slug };
  });

const isWide = (key) => /^(i|f|p|c|w)-/.test(key);

async function download(url, file) {
  if (existsSync(file) && statSync(file).size > 0) return;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  writeFileSync(file, Buffer.from(await res.arrayBuffer()));
}

let failed = 0;
for (const { key, id } of rows) {
  const sizes = isWide(key) ? { sm: [800, 800], lg: [1600, 1200] } : { sm: [640, 640], lg: [1100, 1100] };
  await Promise.all(
    Object.entries(sizes).map(([name, [w, h]]) =>
      download(`https://images.unsplash.com/${id}?w=${w}&h=${h}&q=62&fm=webp&fit=max`, `${OUT}/${key}-${name}.webp`).catch(
        (err) => {
          failed++;
          console.error('FAILED', key, name, err.message);
        },
      ),
    ),
  );
}

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
