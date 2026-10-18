import { motion, type HTMLMotionProps } from 'framer-motion';
import type { ElementType, ReactNode } from 'react';
import { ease, viewportOnce } from './tokens';

interface RevealProps extends HTMLMotionProps<'div'> {
  delay?: number;
  y?: number;
  children: ReactNode;
}

/** Fades and lifts content into place the first time it enters the viewport. */
export function Reveal({ delay = 0, y = 28, children, ...rest }: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewportOnce}
      transition={{ duration: 0.9, ease, delay }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

interface LinesProps {
  lines: ReactNode[];
  as?: ElementType;
  className?: string;
  lineClassName?: string;
  delay?: number;
  /** Animate on mount instead of on scroll into view. */
  immediate?: boolean;
  stagger?: number;
  id?: string;
}

/** Masked line-by-line headline reveal. Lines are explicit so wrapping stays art-directed. */
export function RevealLines({ lines, as: Tag = 'h2', className, lineClassName, delay = 0, immediate, stagger = 0.09, id }: LinesProps) {
  const trigger = immediate ? { animate: 'show' } : { whileInView: 'show', viewport: viewportOnce };
  return (
    <Tag className={className} id={id}>
      <motion.span className="block" initial="hidden" {...trigger} transition={{ staggerChildren: stagger, delayChildren: delay }}>
        {lines.map((line, i) => (
          <span key={i} className="block overflow-hidden pb-[0.08em]">
            <motion.span
              className={lineClassName ?? 'block'}
              variants={{
                hidden: { y: '108%' },
                show: { y: '0%', transition: { duration: 1.05, ease } },
              }}
            >
              {line}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}
