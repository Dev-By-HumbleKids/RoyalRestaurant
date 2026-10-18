import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useCallback, useEffect, useRef, type PointerEvent } from 'react';
import { createPortal } from 'react-dom';
import type { ImageKey } from '@/data/images';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { imageSources, pad2 } from '@/lib/utils';
import { ease } from '@/motion/tokens';

export interface LightboxItem {
  image: ImageKey;
  caption: string;
}

interface Props {
  items: LightboxItem[];
  index: number | null;
  onChange: (index: number | null) => void;
}

/** Full-screen gallery viewer: close button / Escape / backdrop, arrow keys, swipe, focus trap. */
export function Lightbox({ items, index, onChange }: Props) {
  return createPortal(
    <AnimatePresence>{index !== null && <Viewer items={items} index={index} onChange={onChange} />}</AnimatePresence>,
    document.body,
  );
}

function Viewer({ items, index, onChange }: { items: LightboxItem[]; index: number; onChange: Props['onChange'] }) {
  const ref = useRef<HTMLDivElement>(null);
  const startX = useRef<number | null>(null);
  const close = useCallback(() => onChange(null), [onChange]);
  const go = useCallback((delta: number) => onChange((index + delta + items.length) % items.length), [index, items.length, onChange]);
  useFocusTrap(ref, true, close);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go]);

  const item = items[index];
  const { src, srcSet, alt } = imageSources(item.image);

  const onPointerDown = (e: PointerEvent) => {
    startX.current = e.clientX;
  };
  const onPointerUp = (e: PointerEvent) => {
    if (startX.current === null) return;
    const dx = e.clientX - startX.current;
    if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
    startX.current = null;
  };

  return (
    <motion.div
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-label="Gallery"
      className="fixed inset-0 z-[85] flex flex-col bg-obsidian/96"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="container-x flex h-20 items-center justify-between">
        <p className="text-xs uppercase tracking-[0.24em] text-muted tabular" aria-live="polite">
          {pad2(index + 1)} / {pad2(items.length)}
        </p>
        <button
          type="button"
          onClick={close}
          className="grid h-11 w-11 place-items-center rounded-full border border-line/30 text-ivory transition-colors hover:border-accent hover:text-accent"
          aria-label="Close gallery"
        >
          <X className="h-5 w-5" aria-hidden />
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 md:px-24" onPointerDown={onPointerDown} onPointerUp={onPointerUp}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.figure
            key={item.image}
            className="flex h-full max-h-full w-full flex-col items-center justify-center gap-4"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.5, ease }}
          >
            <img src={src} srcSet={srcSet} sizes="90vw" alt={alt} className="max-h-[calc(100%-3rem)] w-auto max-w-full select-none object-contain" draggable={false} />
            <figcaption className="font-display text-xl italic text-stone">{item.caption}</figcaption>
          </motion.figure>
        </AnimatePresence>
        <button
          type="button"
          onClick={() => go(-1)}
          className="absolute left-2 top-1/2 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-line/30 text-ivory transition-colors hover:border-accent hover:text-accent md:grid md:left-6"
          aria-label="Previous image"
        >
          <ChevronLeft className="h-5 w-5" aria-hidden />
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          className="absolute right-2 top-1/2 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-line/30 text-ivory transition-colors hover:border-accent hover:text-accent md:grid md:right-6"
          aria-label="Next image"
        >
          <ChevronRight className="h-5 w-5" aria-hidden />
        </button>
      </div>

      <div className="flex justify-center gap-3 pb-6 pt-3 md:hidden">
        <button type="button" onClick={() => go(-1)} className="grid h-12 w-12 place-items-center rounded-full border border-line/30" aria-label="Previous image">
          <ChevronLeft className="h-5 w-5" aria-hidden />
        </button>
        <button type="button" onClick={() => go(1)} className="grid h-12 w-12 place-items-center rounded-full border border-line/30" aria-label="Next image">
          <ChevronRight className="h-5 w-5" aria-hidden />
        </button>
      </div>
    </motion.div>
  );
}
