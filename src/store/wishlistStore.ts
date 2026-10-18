import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface WishlistState {
  ids: string[];
  open: boolean;
  toggle: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
  setOpen: (open: boolean) => void;
}

/** "My Evening" — dishes and wines a guest wants to remember; can be attached to a reservation as a note. */
export const useWishlist = create<WishlistState>()(
  persist(
    (set) => ({
      ids: [],
      open: false,
      toggle: (id) => set((s) => ({ ids: s.ids.includes(id) ? s.ids.filter((x) => x !== id) : [...s.ids, id] })),
      remove: (id) => set((s) => ({ ids: s.ids.filter((x) => x !== id) })),
      clear: () => set({ ids: [] }),
      setOpen: (open) => set({ open }),
    }),
    {
      name: 'royal.my-evening',
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ ids: s.ids }),
    },
  ),
);
