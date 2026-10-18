import { create } from 'zustand';

interface ToastState {
  message: string | null;
  id: number;
  show: (message: string) => void;
  hide: () => void;
}

let timer: ReturnType<typeof setTimeout> | undefined;

export const useToast = create<ToastState>((set) => ({
  message: null,
  id: 0,
  show: (message) => {
    clearTimeout(timer);
    set((s) => ({ message, id: s.id + 1 }));
    timer = setTimeout(() => set({ message: null }), 3600);
  },
  hide: () => set({ message: null }),
}));
