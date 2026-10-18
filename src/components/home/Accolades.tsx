import { accolades } from '@/data/story';

/** Slow marquee of fictional accolades. Pauses on hover; static for reduced motion (via global CSS). */
export function Accolades() {
  const row = [...accolades, ...accolades];
  return (
    <section aria-label="Accolades (fictional)" className="group overflow-hidden border-y border-line/15 bg-obsidian py-7">
      <ul className="sr-only">
        {accolades.map((a) => (
          <li key={a}>{a}</li>
        ))}
      </ul>
      <div aria-hidden className="flex w-max animate-marquee gap-16 group-hover:[animation-play-state:paused]">
        {row.map((a, i) => (
          <span key={i} className="flex items-center gap-16 whitespace-nowrap font-display text-2xl font-light italic text-stone">
            {a}
            <span className="text-champagne not-italic">✦</span>
          </span>
        ))}
      </div>
    </section>
  );
}
