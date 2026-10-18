import { useState, type ImgHTMLAttributes } from 'react';
import type { ImageKey } from '@/data/images';
import { cn, imageSources } from '@/lib/utils';

interface ImgProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet' | 'alt'> {
  k: ImageKey;
  alt?: string;
  /** Above-the-fold images load eagerly with high priority. */
  priority?: boolean;
}

/** Responsive WebP image with a soft fade-in once decoded. */
export function Img({ k, alt, priority, className, sizes = '(min-width: 1024px) 50vw, 100vw', onLoad, ...rest }: ImgProps) {
  const { src, srcSet, alt: defaultAlt } = imageSources(k);
  const [loaded, setLoaded] = useState(false);
  return (
    <img
      src={src}
      srcSet={srcSet}
      sizes={sizes}
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
