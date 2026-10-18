import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { DiningArea, Reservation } from '@/types';

export type Step = 0 | 1 | 2 | 3 | 4;

export interface DetailsDraft {
  name: string;
  email: string;
  phone: string;
  occasion: string;
  dietary: string;
  requests: string;
  attachWishlist: boolean;
}

interface ReservationDraft {
  step: Step;
  partySize: number;
  date: string | null;
  time: string | null;
  area: DiningArea | null;
  tableId: string | null;
  details: DetailsDraft;
  confirmed: Reservation | null;
}

interface ReservationActions {
  setStep: (step: Step) => void;
  setPartySize: (n: number) => void;
  setDate: (date: string) => void;
  setTime: (time: string) => void;
  setArea: (area: DiningArea | null) => void;
  setTable: (tableId: string | null, area?: DiningArea) => void;
  setDetails: (details: Partial<DetailsDraft>) => void;
  prefill: (p: { area?: DiningArea; occasion?: string; note?: string }) => void;
  confirm: (r: Reservation) => void;
  reset: () => void;
}

const emptyDetails: DetailsDraft = {
  name: '',
  email: '',
  phone: '',
  occasion: '',
  dietary: '',
  requests: '',
  attachWishlist: true,
};

const initial: ReservationDraft = {
  step: 0,
  partySize: 2,
  date: null,
  time: null,
  area: null,
  tableId: null,
  details: emptyDetails,
  confirmed: null,
};

/** The booking flow survives a refresh (sessionStorage) but not a new browser session. */
export const useReservation = create<ReservationDraft & ReservationActions>()(
  persist(
    (set) => ({
      ...initial,
      setStep: (step) => set({ step }),
      // Changing an earlier choice invalidates the later ones.
      setPartySize: (partySize) => set({ partySize, time: null, tableId: null }),
      setDate: (date) => set({ date, time: null, tableId: null }),
      setTime: (time) => set({ time, tableId: null }),
      setArea: (area) => set({ area, tableId: null }),
      setTable: (tableId, area) => set((s) => ({ tableId, area: area ?? s.area })),
      setDetails: (details) => set((s) => ({ details: { ...s.details, ...details } })),
      prefill: ({ area, occasion, note }) =>
        set((s) => ({
          ...initial,
          partySize: s.partySize,
          area: area ?? null,
          details: {
            ...s.details,
            occasion: occasion ?? s.details.occasion,
            requests: note ? note : s.details.requests,
          },
        })),
      confirm: (confirmed) => set({ confirmed }),
      reset: () => set((s) => ({ ...initial, details: { ...emptyDetails, name: s.details.name, email: s.details.email, phone: s.details.phone } })),
    }),
    {
      name: 'royal.reservation-draft',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
