import { AnimatePresence, motion } from 'framer-motion';
import { ease } from '@/motion/tokens';
import { useToast } from '@/store/toastStore';

export function Toaster() {
  const { message, id } = useToast();
  return (
    <div aria-live="polite" role="status" className="pointer-events-none fixed inset-x-0 bottom-6 z-[90] flex justify-center px-4">
      <AnimatePresence>
        {message && (
          <motion.p
            key={id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.45, ease }}
            className="border border-line/30 bg-espresso px-5 py-3 text-sm text-ivory shadow-2xl"
          >
            {message}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
