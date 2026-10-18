# Backend integration

ROYAL ships as a **frontend-only demonstration**. Nothing is sent to a server: reservations live in the visitor's
`localStorage`, and the private-dining form shows a demo success state without sending anything. This document shows
where a real backend would plug in.

## The seam: `ReservationService`

All booking UI talks to one interface, [`src/services/reservationService.ts`](../src/services/reservationService.ts):

| Method | Purpose |
|---|---|
| `getMonthAvailability(month, partySize)` | Day-level status for the calendar |
| `getDaySlots(date, partySize)` | Time slots with `available` / `limited` / `full` / `closed` |
| `getTables(date, time, partySize)` | Per-table state for the floor plan |
| `createReservation(input)` | Create a request; may throw `SlotUnavailableError` with alternative times |
| `findReservation(reference, email)` | Look-up for the manage page |
| `updateReservation(reference, email, patch)` | Change date, time or party size (availability is re-checked) |
| `cancelReservation(reference, email)` | Cancel |

The app picks the implementation in [`src/services/index.ts`](../src/services/index.ts). Today that is
`localReservationService`. To go live:

1. Implement the interface against your API (REST, Supabase, Firebase…). Keep the same error classes so the UI keeps
   its conflict and retry states.
2. Return your adapter from `src/services/index.ts`, for example behind `import.meta.env.VITE_DATA_SOURCE`.
3. Move availability to the server. `src/services/availability.ts` is a deterministic **demo** generator and must not
   decide real capacity.

## Suggested Supabase schema

See [`supabase/schema.sql`](../supabase/schema.sql): `tables`, `reservations` and a `reservation_slots` view.
Recommended extras for production:

- Row Level Security: guests can read or modify a reservation only through a signed manage link or OTP email,
  never by reference + email alone.
- A unique constraint on `(table_id, date, time)` for active reservations, so two guests can never take the same table.
- An Edge Function to send confirmation emails, which this demo deliberately does not do.

## Other integration points

| Feature | Demo behaviour | Production |
|---|---|---|
| Private-dining inquiry (`/contact`) | Validates, waits ~1s, shows a demo reference | POST to an events inbox or CRM |
| "Notify me" on a full slot | Toast only | Waitlist table + notification job |
| Add to calendar | Generates an `.ics` file client-side | Same, optionally attached to the confirmation email |
| QR code | Encodes the reference only | Signed manage URL |
| Simulated failures | `localStorage.setItem('royal.demo.conflictRate', '1')` or `'royal.demo.errorRate'` | — |

No payment, deposit capture or email delivery exists anywhere in this project.
