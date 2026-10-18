import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import type { ImageKey } from '@/data/images';
import { cn } from '@/lib/utils';
import { ease } from '@/motion/tokens';
import { Img } from './Img';

interface Props {
  k: ImageKey;
  className?: string;
  imgClassName?: string;
  /** Percentage the image drifts while the frame crosses the viewport. */
  strength?: number;
  arch?: boolean;
  reveal?: boolean;
  sizes?: string;
  alt?: string;
  priority?: boolean;
}

/** An image frame whose photo drifts slightly against the scroll, with an optional mask reveal. */
export function ParallaxImage({ k, className, imgClassName, strength = 10, arch, reveal = true, sizes, alt, priority }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [`-${strength}%`, `${strength}%`]);

  return (
    <motion.div
      ref={ref}
      className={cn('relative overflow-hidden bg-charcoal', arch && 'arch', className)}
      initial={reveal ? { clipPath: 'inset(100% 0% 0% 0%)' } : false}
      whileInView={{ clipPath: 'inset(0% 0% 0% 0%)' }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 1.3, ease }}
    >
      <motion.div className="absolute inset-[-12%_0]" style={{ y }}>
        <Img k={k} alt={alt} sizes={sizes} priority={priority} className={cn('h-full w-full object-cover', imgClassName)} />
      </motion.div>
    </motion.div>
  );
}
