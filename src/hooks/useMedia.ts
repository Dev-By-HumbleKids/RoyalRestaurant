import { useEffect, useState } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => (typeof window === 'undefined' ? false : window.matchMedia(query).matches));
  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);
  return matches;
}

/** True for a mouse/trackpad on a large screen — where hover-driven effects make sense. */
export const useFinePointer = () => useMediaQuery('(hover: hover) and (pointer: fine) and (min-width: 1024px)');

export const usePrefersReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)');
