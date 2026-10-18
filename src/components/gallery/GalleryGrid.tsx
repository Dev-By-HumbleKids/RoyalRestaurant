import { motion } from 'framer-motion';
import { useState } from 'react';
import { Img } from '@/components/ui/Img';
import { Lightbox, type LightboxItem } from '@/components/ui/Lightbox';
import { useI18n } from '@/i18n';
import { cn } from '@/lib/utils';
import { ease } from '@/motion/tokens';

const SPANS = ['md:row-span-2', '', '', 'md:row-span-2', '', '', 'md:col-span-2', 'md:col-span-2'];

/** Editorial masonry: some tiles span two rows. Every tile opens the accessible lightbox. */
export function GalleryGrid({ items, className }: { items: LightboxItem[]; className?: string }) {
  const [open, setOpen] = useState<number | null>(null);
  const { t } = useI18n();

  return (
    <>
      <ul className={cn('grid grid-flow-dense auto-rows-[220px] grid-cols-2 gap-3 md:auto-rows-[240px] md:grid-cols-4 md:gap-4', className)}>
        {items.map((item, i) => (
          <motion.li
            key={item.image}
            layout
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '0px 0px -8% 0px' }}
            transition={{ duration: 0.8, ease, delay: (i % 4) * 0.06 }}
            className={cn('relative overflow-hidden bg-charcoal', SPANS[i % SPANS.length])}
          >
            <button
              type="button"
              onClick={() => setOpen(i)}
              className="press group block h-full w-full"
              aria-label={t.lightbox.open(item.caption)}
              data-cursor={t.common.viewCursor}
            >
              <Img k={item.image} alt="" sizes="(min-width: 768px) 25vw, 50vw" className="h-full w-full object-cover transition-transform duration-[1.4s] ease-luxe group-hover:scale-[1.06]" />
              <span
                aria-hidden
                className="absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-obsidian/85 to-transparent p-4 text-left font-display text-lg italic text-ivory opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 [@media(hover:none)]:translate-y-0 [@media(hover:none)]:opacity-100"
              >
                {item.caption}
              </span>
            </button>
          </motion.li>
        ))}
      </ul>
      <Lightbox items={items} index={open} onChange={setOpen} />
    </>
  );
}
