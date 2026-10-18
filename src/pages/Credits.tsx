import tsv from '../../scripts/images.tsv?raw';
import { Img } from '@/components/ui/Img';
import type { ImageKey } from '@/data/images';

const rows = tsv
  .split(/\r?\n/)
  .filter(Boolean)
  .map((line) => {
    const [key, , slug] = line.split('\t');
    return { key: key as ImageKey, url: `https://unsplash.com/photos/${slug}` };
  });

export default function Credits() {
  return (
    <section className="bg-obsidian pb-28 pt-36 md:pt-44" aria-labelledby="credits-title">
      <div className="container-x">
        <p className="eyebrow mb-6">Colophon</p>
        <h1 id="credits-title" className="display-lg text-ivory">
          Photo credits
        </h1>
        <p className="lede mt-6 max-w-2xl">
          ROYAL is a fictional restaurant. All photography comes from Unsplash under the Unsplash License and is used illustratively — none of the places, dishes or people
          pictured are connected to this project. Typography: Cormorant Garamond and Manrope (Google Fonts).
        </p>
        <ul className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {rows.map((r) => (
            <li key={r.key}>
              <a href={r.url} target="_blank" rel="noopener noreferrer" className="group block">
                <span className="block aspect-square overflow-hidden bg-charcoal">
                  <Img k={r.key} alt="" sizes="200px" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </span>
                <span className="link-underline mt-2 block truncate text-xs text-muted group-hover:text-fg">
                  {r.key} <span className="sr-only">(opens Unsplash)</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
