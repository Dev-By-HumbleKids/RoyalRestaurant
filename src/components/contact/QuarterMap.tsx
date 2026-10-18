/** Stylised map of the fictional Old Quarter of Valmont. Decorative — not a real place. */
export function QuarterMap() {
  return (
    <figure className="relative overflow-hidden border border-line/20 bg-[#15120F]">
      <svg viewBox="0 0 600 440" className="h-auto w-full" role="img" aria-labelledby="map-title map-desc">
        <title id="map-title">Map of the Old Quarter, Valmont</title>
        <desc id="map-desc">A stylised, fictional map. ROYAL sits on the Arcade Royale between the river and Place des Lanternes.</desc>
        <defs>
          <pattern id="blocks" width="12" height="12" patternUnits="userSpaceOnUse">
            <path d="M0 12L12 0" stroke="rgba(197,164,109,0.07)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="600" height="440" fill="url(#blocks)" />
        {/* River */}
        <path d="M-10 360 C 120 320, 200 400, 320 360 S 520 300, 620 330 L 620 460 L -10 460 Z" fill="#1E2A2E" opacity="0.8" />
        <path d="M-10 360 C 120 320, 200 400, 320 360 S 520 300, 620 330" fill="none" stroke="rgba(244,239,230,0.15)" />
        {/* Streets */}
        <g stroke="rgba(244,239,230,0.14)" strokeWidth="14" fill="none" strokeLinecap="round">
          <path d="M40 60 L 560 120" />
          <path d="M80 260 L 540 220" />
          <path d="M180 20 L 230 340" />
          <path d="M420 30 L 380 320" />
        </g>
        <g stroke="rgba(244,239,230,0.07)" strokeWidth="6" fill="none">
          <path d="M60 160 L 560 170" />
          <path d="M300 40 L 310 330" />
          <path d="M120 100 L 140 300" />
          <path d="M500 80 L 480 300" />
        </g>
        {/* Arcade Royale — highlighted */}
        <path d="M80 260 L 540 220" stroke="rgba(197,164,109,0.55)" strokeWidth="2" strokeDasharray="2 6" fill="none" />
        {/* Place des Lanternes */}
        <circle cx="300" cy="165" r="34" fill="none" stroke="rgba(197,164,109,0.35)" />
        <circle cx="300" cy="165" r="3" fill="rgba(197,164,109,0.6)" />
        <g fontFamily="Manrope, sans-serif" fontSize="10" letterSpacing="3" fill="rgba(184,173,160,0.65)">
          <text x="300" y="120" textAnchor="middle">PLACE DES LANTERNES</text>
          <text x="470" y="210" textAnchor="middle" transform="rotate(-5 470 210)">ARCADE ROYALE</text>
          <text x="90" y="80" transform="rotate(7 90 80)">RUE DU MARCHÉ</text>
          <text x="470" y="395" textAnchor="middle" fill="rgba(244,239,230,0.35)">THE VALE RIVER</text>
        </g>
        {/* ROYAL marker */}
        <g transform="translate(330 238)">
          <circle r="22" fill="rgba(197,164,109,0.15)">
            <animate attributeName="r" values="14;30;14" dur="3.2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.8;0;0.8" dur="3.2s" repeatCount="indefinite" />
          </circle>
          <path d="M-9 14 V-2 a9 9 0 0 1 18 0 V14" fill="#11110F" stroke="#C5A46D" strokeWidth="1.6" />
          <circle cy="-1" r="2" fill="#C5A46D" />
          <text y="34" textAnchor="middle" fontFamily="'Cormorant Garamond', serif" fontSize="18" letterSpacing="5" fill="#F4EFE6">
            ROYAL
          </text>
        </g>
      </svg>
      <figcaption className="absolute bottom-3 left-4 text-[10px] uppercase tracking-[0.2em] text-muted">Illustrative map · fictional location</figcaption>
    </figure>
  );
}
