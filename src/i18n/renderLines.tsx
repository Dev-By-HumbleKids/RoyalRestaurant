import type { ReactNode } from 'react';

/** Heading lines: an entry starting with "~" renders in italics. */
export function renderLines(lines: readonly string[]): ReactNode[] {
  return lines.map((line, i) => (line.startsWith('~') ? <em key={i}>{line.slice(1)}</em> : line));
}
