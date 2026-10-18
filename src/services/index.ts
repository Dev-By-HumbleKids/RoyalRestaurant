import { localReservationService } from './localReservationService';
import type { ReservationService } from './reservationService';

/**
 * Single place to swap the data source. A production build would return a REST/Supabase adapter here,
 * e.g. based on `import.meta.env.VITE_DATA_SOURCE`.
 */
export const reservationService: ReservationService = localReservationService;

export * from './reservationService';
