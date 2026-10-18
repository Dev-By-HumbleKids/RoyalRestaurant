/** Booking rules for the fictional restaurant. All availability derived from them is illustrative demo data. */
export const RULES = {
  maxDaysAhead: 60,
  sameDayCutoffHours: 2,
  minParty: 1,
  maxPartyOnline: 8,
  dinnerSlots: ['18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30'],
  lunchSlots: ['12:00', '12:30', '13:00', '13:30', '14:00'],
  /** 0 = Sunday … 6 = Saturday */
  closedWeekdays: [1],
  lunchWeekdays: [5, 6, 0],
  durationMinutes: 150,
} as const;

export const OCCASIONS = ['Birthday', 'Anniversary', 'Proposal', 'Business', 'Celebration', 'Just because'] as const;
