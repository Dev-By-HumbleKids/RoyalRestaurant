/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        obsidian: '#11110F',
        espresso: '#211914',
        charcoal: '#292724',
        burgundy: '#4A1825',
        champagne: { DEFAULT: '#C5A46D', soft: '#E2C99A', deep: '#8A6A32' },
        ivory: '#F4EFE6',
        stone: '#B8ADA0',
        // Semantic tokens: flip between the dark foundation and ivory editorial sections (.theme-ivory).
        bg: 'rgb(var(--bg) / <alpha-value>)',
        fg: 'rgb(var(--fg) / <alpha-value>)',
        muted: 'rgb(var(--muted) / <alpha-value>)',
        accent: 'rgb(var(--accent) / <alpha-value>)',
        line: 'rgb(var(--line) / <alpha-value>)',
        surface: 'rgb(var(--surface) / <alpha-value>)',
        status: { available: '#93B58C', limited: '#DDB04F', full: '#D06A58' },
      },
      fontFamily: {
        // Myanmar glyphs fall through to Noto (Google serves them as a separate unicode-range subset).
        display: ['"Cormorant Garamond"', '"Noto Serif Myanmar"', 'Georgia', 'serif'],
        sans: ['Manrope', '"Noto Sans Myanmar"', 'system-ui', 'sans-serif'],
      },
      letterSpacing: { eyebrow: '0.28em' },
      transitionTimingFunction: { luxe: 'cubic-bezier(0.22, 1, 0.36, 1)' },
      maxWidth: { content: '1440px', prose: '64ch' },
      borderRadius: { arch: '9999px 9999px 0 0' },
      keyframes: {
        'scroll-cue': {
          '0%': { transform: 'scaleY(0)', transformOrigin: 'top' },
          '45%': { transform: 'scaleY(1)', transformOrigin: 'top' },
          '55%': { transform: 'scaleY(1)', transformOrigin: 'bottom' },
          '100%': { transform: 'scaleY(0)', transformOrigin: 'bottom' },
        },
        marquee: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
        flicker: {
          '0%, 100%': { opacity: '0.55' },
          '40%': { opacity: '0.75' },
          '70%': { opacity: '0.6' },
        },
      },
      animation: {
        'scroll-cue': 'scroll-cue 2.4s cubic-bezier(0.22, 1, 0.36, 1) infinite',
        marquee: 'marquee 48s linear infinite',
        flicker: 'flicker 5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
