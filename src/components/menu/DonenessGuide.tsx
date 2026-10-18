import { motion } from 'framer-motion';
import { useId, useState } from 'react';
import { cn } from '@/lib/utils';

const LEVELS = [
  { name: 'Blue', c: 46, centre: '#7A1424', ring: '#9C2236', note: 'Seared hard, cool at the centre. For the purist — and for our 90-day striploin.' },
  { name: 'Rare', c: 50, centre: '#9A1F31', ring: '#B8414F', note: 'Deep red, barely warm. The marbling has just begun to soften.' },
  { name: 'Medium-rare', c: 55, centre: '#B9404F', ring: '#C96A6C', note: 'Our recommendation. The fat renders, the centre stays rosy and juicy.' },
  { name: 'Medium', c: 60, centre: '#C26A6A', ring: '#B9857A', note: 'Warm pink throughout — firmer, still generous.' },
  { name: 'Medium-well', c: 65, centre: '#B98A7C', ring: '#9E7D6E', note: 'A blush of pink at the very heart. We rest it a little longer.' },
  { name: 'Well done', c: 70, centre: '#8F7464', ring: '#7C6455', note: 'Cooked through, slowly, so it never turns dry. Available on request.' },
];

/** Interactive doneness slider: a cross-section illustration, core temperature and a chef's note. */
export function DonenessGuide() {
  const [level, setLevel] = useState(2);
  const [unit, setUnit] = useState<'C' | 'F'>('C');
  const id = useId();
  const l = LEVELS[level];
  const temp = unit === 'C' ? l.c : Math.round((l.c * 9) / 5 + 32);

  return (
    <div className="border border-line/20 p-5 sm:p-6">
      <div className="flex items-center justify-between gap-4">
        <p className="eyebrow">Doneness guide</p>
        <div className="flex border border-line/25 text-[11px] font-semibold" role="group" aria-label="Temperature unit">
          {(['C', 'F'] as const).map((u) => (
            <button
              key={u}
              type="button"
              onClick={() => setUnit(u)}
              aria-pressed={unit === u}
              className={cn('h-9 w-10 transition-colors', unit === u ? 'bg-champagne text-obsidian' : 'text-muted hover:text-fg')}
            >
              °{u}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 grid items-center gap-6 sm:grid-cols-[150px_1fr]">
        <svg viewBox="0 0 160 110" className="mx-auto w-40 sm:w-full" role="img" aria-label={`Cross-section of a steak cooked ${l.name.toLowerCase()}`}>
          <defs>
            <radialGradient id={`${id}-g`} cx="50%" cy="50%" r="55%">
              <motion.stop offset="0%" animate={{ stopColor: l.centre }} transition={{ duration: 0.6 }} />
              <motion.stop offset="70%" animate={{ stopColor: l.ring }} transition={{ duration: 0.6 }} />
              <stop offset="100%" stopColor="#6B4A3A" />
            </radialGradient>
          </defs>
          <ellipse cx="80" cy="56" rx="74" ry="48" fill="#3A2418" />
          <ellipse cx="80" cy="56" rx="68" ry="42" fill={`url(#${id}-g)`} />
          <path d="M30 40c20-8 40 4 58-2s32-6 44 2" stroke="#F1E2D0" strokeOpacity="0.35" strokeWidth="2" fill="none" />
          <path d="M40 70c16 6 30-4 46 2s28 4 38-2" stroke="#F1E2D0" strokeOpacity="0.25" strokeWidth="1.5" fill="none" />
        </svg>
        <div>
          <p className="font-display text-3xl text-ivory" aria-live="polite">
            {l.name} <span className="ml-2 text-xl text-champagne tabular">{temp}°{unit}</span>
          </p>
          <p className="mt-2 text-sm leading-relaxed text-fg/75">{l.note}</p>
        </div>
      </div>

      <label htmlFor={`${id}-r`} className="sr-only">
        Choose doneness
      </label>
      <input
        id={`${id}-r`}
        type="range"
        min={0}
        max={LEVELS.length - 1}
        step={1}
        value={level}
        onChange={(e) => setLevel(Number(e.target.value))}
        aria-valuetext={`${l.name}, ${temp} degrees ${unit === 'C' ? 'Celsius' : 'Fahrenheit'}`}
        className="mt-6 w-full accent-[#C5A46D]"
      />
      <div className="mt-2 flex justify-between text-[10px] uppercase tracking-[0.14em] text-muted" aria-hidden>
        <span>Blue</span>
        <span>Medium-rare</span>
        <span>Well done</span>
      </div>
    </div>
  );
}
