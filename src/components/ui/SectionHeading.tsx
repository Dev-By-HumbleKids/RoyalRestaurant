import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Reveal, RevealLines } from '@/motion/Reveal';

interface Props {
  eyebrow: string;
  lines: ReactNode[];
  lede?: ReactNode;
  align?: 'left' | 'center';
  size?: 'xl' | 'lg' | 'md';
  className?: string;
  id?: string;
  as?: 'h1' | 'h2' | 'h3';
}

export function SectionHeading({ eyebrow, lines, lede, align = 'left', size = 'lg', className, id, as = 'h2' }: Props) {
  return (
    <div className={cn('max-w-4xl', align === 'center' && 'mx-auto text-center', className)}>
      <Reveal>
        <p className={cn('eyebrow mb-6 flex items-center gap-4', align === 'center' && 'justify-center')}>
          <span aria-hidden className="h-px w-10 bg-accent/60" />
          {eyebrow}
        </p>
      </Reveal>
      <RevealLines
        as={as}
        lines={lines}
        className={cn(size === 'xl' ? 'display-xl' : size === 'lg' ? 'display-lg' : 'display-md', 'text-fg')}
        id={id}
      />
      {lede && (
        <Reveal delay={0.15}>
          <p className={cn('lede mt-8 max-w-prose', align === 'center' && 'mx-auto')}>{lede}</p>
        </Reveal>
      )}
    </div>
  );
}
