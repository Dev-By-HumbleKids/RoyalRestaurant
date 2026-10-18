import { FLOOR } from '@/data/tables';
import { cn } from '@/lib/utils';
import type { RestaurantTable } from '@/types';
import type { FloorPlanProps, TableState } from './planTypes';

const S = 40; // px per metre in the SVG
const W = FLOOR.width * S;
const D = FLOOR.depth * S;
const px = (x: number) => (x + FLOOR.width / 2) * S;
const pz = (z: number) => (z + FLOOR.depth / 2) * S;
const pct = (x: number, z: number) => ({ left: `${(px(x) / W) * 100}%`, top: `${(pz(z) / D) * 100}%` });

const fill: Record<TableState, string> = {
  free: 'rgba(197,164,109,0.16)',
  booked: 'rgba(208,106,88,0.22)',
  unsuitable: 'rgba(184,173,160,0.06)',
  idle: 'rgba(197,164,109,0.12)',
};

function TableShape({ t, state, selected }: { t: RestaurantTable; state: TableState; selected: boolean }) {
  const stroke = selected ? '#E2C99A' : state === 'booked' ? '#D06A58' : state === 'unsuitable' ? 'rgba(184,173,160,0.25)' : '#C5A46D';
  const f = selected ? '#C5A46D' : fill[state];
  const r = t.maxSeats > 4 ? 0.75 : t.maxSeats > 2 ? 0.6 : 0.45;
  if (t.shape === 'round') return <circle cx={px(t.x)} cy={pz(t.z)} r={r * S} fill={f} stroke={stroke} strokeWidth={1.4} />;
  if (t.shape === 'square') return <rect x={px(t.x) - 0.45 * S} y={pz(t.z) - 0.45 * S} width={0.9 * S} height={0.9 * S} fill={f} stroke={stroke} strokeWidth={1.4} />;
  const w = (t.w ?? 1.6) * (t.shape === 'room' ? 0.55 : 1);
  const d = (t.d ?? 0.9) * (t.shape === 'room' ? 0.35 : 1);
  return <rect x={px(t.x) - (w * S) / 2} y={pz(t.z) - (d * S) / 2} width={w * S} height={d * S} fill={f} stroke={stroke} strokeWidth={1.4} />;
}

/**
 * Architectural top-down plan. Visuals are SVG; every interactive element is a real HTML button positioned
 * over it, so the plan works with keyboard, screen readers and touch. Used on mobile, with reduced motion,
 * and as the accessible companion to the 3D scene.
 */
export function FloorPlan2D({ mode, tables, selectedId, onSelectTable, spaces = [], activeSpaceId, onSelectSpace }: FloorPlanProps) {
  return (
    <div className="relative w-full" style={{ aspectRatio: `${W} / ${D}` }}>
      <svg viewBox={`0 0 ${W} ${D}`} className="absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          <pattern id="hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="8" stroke="rgba(197,164,109,0.18)" strokeWidth="1" />
          </pattern>
          <radialGradient id="ember" cx="50%" cy="100%" r="80%">
            <stop offset="0%" stopColor="#E07A3A" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#4A1825" stopOpacity="0.2" />
          </radialGradient>
        </defs>
        {/* Shell */}
        <rect x="1" y="1" width={W - 2} height={D - 2} fill="#171512" stroke="rgba(197,164,109,0.45)" strokeWidth="2" />
        {/* Barrel vault ribs over the main room */}
        {[-4.5, -3, -1.5, 0, 1.5, 3, 4.5].map((z) => (
          <line key={z} x1={px(-6)} x2={px(6)} y1={pz(z)} y2={pz(z)} stroke="rgba(197,164,109,0.07)" strokeDasharray="4 6" />
        ))}
        {/* Private rooms & vault */}
        <rect x={px(-11)} y={pz(-8)} width={4.5 * S} height={7.5 * S} fill="#0E0D0B" stroke="rgba(197,164,109,0.4)" />
        <rect x={px(6.5)} y={pz(-8)} width={4.5 * S} height={5.4 * S} fill="url(#hatch)" stroke="rgba(197,164,109,0.4)" />
        <rect x={px(6.5)} y={pz(-2.6)} width={4.5 * S} height={4.6 * S} fill="#120F0C" stroke="rgba(197,164,109,0.4)" />
        {/* Hearth */}
        <rect x={px(-2)} y={pz(-8) + 4} width={4 * S} height={0.9 * S} fill="url(#ember)" stroke="#C2602F" />
        {/* Facade arches */}
        {[-8.5, -6, -3.5, 0, 3.5, 6, 8.5].map((x) => (
          <path key={x} d={`M${px(x) - 30} ${D - 1} a30 30 0 0 1 60 0`} fill="none" stroke="rgba(197,164,109,0.35)" />
        ))}
        {/* Reception */}
        <rect x={px(-1.2)} y={pz(6.4)} width={2.4 * S} height={0.5 * S} fill="#2B2018" stroke="rgba(197,164,109,0.4)" />
        {/* Area labels */}
        {[
          { x: -8.75, z: -7.3, t: 'SALON NOIR' },
          { x: 8.75, z: -7.3, t: 'THE VAULT' },
          { x: 8.75, z: -2.0, t: 'CELLAR ROOM' },
          { x: 0, z: -3.6, t: 'MAIN DINING ROOM' },
          { x: -6.6, z: 4.8, t: 'WINDOW ARCADE' },
          { x: 0, z: 7.4, t: 'ENTRANCE' },
          { x: 0, z: -4.5, t: 'CHEF’S COUNTER' },
        ].map((l) => (
          <text key={l.t} x={px(l.x)} y={pz(l.z)} textAnchor="middle" fill="rgba(184,173,160,0.6)" fontSize="11" letterSpacing="3" fontFamily="Manrope, sans-serif">
            {l.t}
          </text>
        ))}
        {tables.map(({ table, state }) => (
          <TableShape key={table.id} t={table} state={state} selected={table.id === selectedId} />
        ))}
      </svg>

      {mode === 'select' &&
        tables.map(({ table, state }) => {
          const selected = table.id === selectedId;
          const disabled = state !== 'free';
          const statusText = state === 'free' ? 'available' : state === 'booked' ? 'already reserved' : 'not suitable for your party';
          return (
            <button
              key={table.id}
              type="button"
              disabled={disabled}
              onClick={() => onSelectTable?.(table.id)}
              aria-pressed={selected}
              aria-label={`${table.label}, ${table.minSeats}–${table.maxSeats} seats, ${statusText}`}
              className={cn(
                'absolute grid min-h-[30px] min-w-[30px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full text-[9px] font-semibold tabular transition-transform sm:min-h-[36px] sm:min-w-[36px] sm:text-[10px]',
                selected ? 'text-obsidian' : state === 'free' ? 'text-champagne hover:scale-110' : 'cursor-not-allowed text-muted/60',
              )}
              style={pct(table.x, table.z)}
            >
              {table.id}
            </button>
          );
        })}

      {mode === 'explore' &&
        spaces.map((s, i) => {
          const active = s.id === activeSpaceId;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => onSelectSpace?.(s.id)}
              aria-pressed={active}
              aria-label={`${i + 1}. ${s.name}`}
              className={cn(
                'absolute grid h-9 w-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border text-[11px] font-semibold tabular transition-all duration-300 sm:h-10 sm:w-10',
                active ? 'scale-110 border-champagne bg-champagne text-obsidian' : 'border-champagne/60 bg-obsidian/80 text-champagne hover:bg-champagne hover:text-obsidian',
              )}
              style={pct(s.hotspot.x, s.hotspot.z)}
            >
              {i + 1}
              {!active && <span aria-hidden className="absolute inset-0 animate-ping rounded-full border border-champagne/40 [animation-duration:2.6s]" />}
            </button>
          );
        })}
    </div>
  );
}
