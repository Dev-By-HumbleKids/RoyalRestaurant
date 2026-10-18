import { useLayoutEffect, useRef, useState, type ImgHTMLAttributes } from 'react';
import type { ImageKey } from '@/data/images';
import { cn, imageSources } from '@/lib/utils';

interface ImgProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet' | 'alt'> {
  k: ImageKey;
  alt?: string;
  /** Above-the-fold images load eagerly with high priority. */
  priority?: boolean;
}

/**
 * Responsive WebP image with a soft fade-in once decoded.
 *
 * `sizes` is only the first guess. Once the element is laid out it measures its own box and, for `object-cover`,
 * how wide the photo is really drawn (a landscape photo in a tall frame is drawn much wider than the frame), so
 * the browser picks a file with enough pixels instead of upscaling a small one.
 */
export function Img({ k, alt, priority, className, sizes = '(min-width: 1024px) 50vw, 100vw', onLoad, ...rest }: ImgProps) {
  const { src, srcSet, alt: defaultAlt, ratio } = imageSources(k);
  const [loaded, setLoaded] = useState(false);
  const [measured, setMeasured] = useState<string | null>(null);
  const ref = useRef<HTMLImageElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      // offsetWidth/Height ignore transforms, so hover zooms and parallax drift do not trigger new downloads.
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      if (!w || !h) return;
      const drawn = getComputedStyle(el).objectFit === 'cover' ? Math.max(w, h * ratio) : w;
      // Round up to 50px steps so small resizes do not keep rewriting the attribute.
      setMeasured(`${Math.ceil(drawn / 50) * 50}px`);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [ratio]);

  return (
    <img
      ref={ref}
      src={src}
      srcSet={srcSet}
      sizes={measured ?? sizes}
      alt={alt ?? defaultAlt}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      // React 18 does not know the camelCase prop yet; the lowercase attribute is passed through as-is.
      {...{ fetchpriority: priority ? 'high' : 'auto' }}
      onLoad={(e) => {
        setLoaded(true);
        onLoad?.(e);
      }}
      className={cn('transition-opacity duration-700 ease-luxe', loaded ? 'opacity-100' : 'opacity-0', className)}
      {...rest}
    />
  );
}
