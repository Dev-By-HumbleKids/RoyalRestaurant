import type { DayAvailability, DiningArea, GuestDetails, Reservation, TableAvailability, TimeSlot } from '@/types';

/**
 * The integration point for a real backend. The site ships with `localReservationService`
 * (browser localStorage, simulated latency). A REST or Supabase adapter only has to implement this
 * interface — see docs/backend-integration.md.
 */
export interface ReservationService {
  getMonthAvailability(month: Date, partySize: number): Promise<DayAvailability[]>;
  getDaySlots(date: string, partySize: number): Promise<TimeSlot[]>;
  getTables(date: string, time: string, partySize: number): Promise<TableAvailability[]>;
  createReservation(input: NewReservation): Promise<Reservation>;
  findReservation(reference: string, email: string): Promise<Reservation>;
  updateReservation(reference: string, email: string, patch: ReservationPatch): Promise<Reservation>;
  cancelReservation(reference: string, email: string): Promise<Reservation>;
}

export interface NewReservation {
  date: string;
  time: string;
  partySize: number;
  area?: DiningArea;
  tableId?: string;
  guest: GuestDetails;
  occasion?: string;
  dietary?: string;
  requests?: string;
  wishlist?: string[];
}

export type ReservationPatch = Pick<Reservation, 'date' | 'time' | 'partySize'>;

export class SlotUnavailableError extends Error {
  constructor(
    message: string,
    public alternatives: string[] = [],
  ) {
    super(message);
    this.name = 'SlotUnavailableError';
  }
}

export class ReservationNotFoundError extends Error {
  constructor() {
    super('We could not find a demo reservation with that reference and email in this browser.');
    this.name = 'ReservationNotFoundError';
  }
}

export class NetworkError extends Error {
  constructor() {
    super('The demo service did not respond. Please try again.');
    this.name = 'NetworkError';
  }
}
