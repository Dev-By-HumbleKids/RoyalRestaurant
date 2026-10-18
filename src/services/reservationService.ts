import type { DayAvailability, DiningArea, GuestDetails, ReasonCode, Reservation, TableAvailability, TimeSlot } from '@/types';

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

/** Error codes are language-neutral; the UI turns them into words with `t.errors` / `t.reasons`. */
export type ErrorCode = 'raced' | 'noTable' | 'noChange' | 'cancelled' | 'notFound' | 'network' | ReasonCode;

export class ReservationError extends Error {
  constructor(public code: ErrorCode) {
    super(code);
    this.name = 'ReservationError';
  }
}

export class SlotUnavailableError extends ReservationError {
  constructor(
    code: ErrorCode,
    public alternatives: string[] = [],
  ) {
    super(code);
    this.name = 'SlotUnavailableError';
  }
}

export class ReservationNotFoundError extends ReservationError {
  constructor() {
    super('notFound');
    this.name = 'ReservationNotFoundError';
  }
}

export class NetworkError extends ReservationError {
  constructor() {
    super('network');
    this.name = 'NetworkError';
  }
}
