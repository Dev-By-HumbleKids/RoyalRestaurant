import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { cn } from '@/lib/utils';
import { ease } from '@/motion/tokens';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  labelledBy: string;
  children: ReactNode;
  variant?: 'center' | 'drawer';
  className?: string;
  closeLabel?: string;
}

/** Accessible dialog: focus trap, Escape to close, scroll lock, focus restore, animated in/out. */
export function Modal({ open, onClose, labelledBy, children, variant = 'center', className, closeLabel = 'Close' }: ModalProps) {
  return createPortal(
    <AnimatePresence>{open && <Dialog {...{ onClose, labelledBy, variant, className, closeLabel }}>{children}</Dialog>}</AnimatePresence>,
    document.body,
  );
}

function Dialog({ onClose, labelledBy, children, variant, className, closeLabel }: Omit<ModalProps, 'open'>) {
  const ref = useRef<HTMLDivElement>(null);
  useFocusTrap(ref, true, onClose);
  const drawer = variant === 'drawer';

  return (
    <div className={cn('fixed inset-0 z-[80] flex', drawer ? 'justify-end' : 'items-end justify-center sm:items-center sm:p-6')}>
      <motion.div
        className="absolute inset-0 bg-obsidian/80 backdrop-blur-[2px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        onClick={onClose}
        aria-hidden
      />
      <motion.div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={-1}
        className={cn(
          'relative z-10 flex max-h-[100svh] w-full flex-col overflow-hidden bg-espresso text-fg shadow-[0_40px_120px_-20px_rgba(0,0,0,0.8)] outline-none',
          drawer ? 'h-full max-w-md border-l border-line/20' : 'max-h-[92svh] max-w-5xl border border-line/20 sm:max-h-[88vh]',
          className,
        )}
        initial={drawer ? { x: '100%' } : { opacity: 0, y: 48, scale: 0.98 }}
        animate={drawer ? { x: 0 } : { opacity: 1, y: 0, scale: 1 }}
        exit={drawer ? { x: '100%' } : { opacity: 0, y: 32, scale: 0.98 }}
        transition={{ duration: 0.6, ease }}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 z-20 grid h-11 w-11 place-items-center rounded-full border border-line/30 bg-obsidian/70 text-ivory transition-colors hover:border-accent hover:text-accent"
          aria-label={closeLabel}
        >
          <X className="h-5 w-5" aria-hidden />
        </button>
        {children}
      </motion.div>
    </div>
  );
}
