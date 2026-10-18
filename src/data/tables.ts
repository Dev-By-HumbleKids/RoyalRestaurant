import type { DiningArea, RestaurantTable } from '@/types';

/**
 * Floor plan of the fictional restaurant, in metres. Origin at the centre of the hall,
 * x runs west → east (−11…11), z runs north (hearth, −8) → south (facade, +8).
 */
export const FLOOR = { width: 22, depth: 16 } as const;

export const areaMeta: Record<
  DiningArea,
  { label: string; short: string; description: string; minParty: number; maxParty: number; dinnerOnly?: boolean }
> = {
  main: {
    label: 'Main Dining Room',
    short: 'Main Room',
    description: 'Under the barrel vault, close to the hearth.',
    minParty: 1,
    maxParty: 6,
  },
  window: {
    label: 'Window Arcade',
    short: 'Window',
    description: 'Along the arched glazing — quieter and romantic.',
    minParty: 1,
    maxParty: 4,
  },
  'chefs-counter': {
    label: 'Chef’s Counter',
    short: 'Counter',
    description: 'Eight seats facing the 1928 hearth. Seven-course tasting only, dinner only.',
    minParty: 2,
    maxParty: 8,
    dinnerOnly: true,
  },
  'salon-noir': {
    label: 'Salon Noir',
    short: 'Salon Noir',
    description: 'Private room with its own bar. 6–8 guests online, up to 12 by inquiry.',
    minParty: 6,
    maxParty: 8,
  },
  'cellar-room': {
    label: 'Cellar Room',
    short: 'Cellar',
    description: 'A private candlelit table inside the Vault. 4–8 guests online.',
    minParty: 4,
    maxParty: 8,
  },
};

export const diningAreas = Object.keys(areaMeta) as DiningArea[];

export const tables: RestaurantTable[] = [
  // Main Dining Room
  { id: 'M1', label: 'Table 1', area: 'main', minSeats: 1, maxSeats: 4, x: -4, z: -2.4, shape: 'round' },
  { id: 'M2', label: 'Table 2', area: 'main', minSeats: 1, maxSeats: 2, x: -1.3, z: -2.4, shape: 'square' },
  { id: 'M3', label: 'Table 3', area: 'main', minSeats: 1, maxSeats: 2, x: 1.3, z: -2.4, shape: 'square' },
  { id: 'M4', label: 'Table 4', area: 'main', minSeats: 1, maxSeats: 4, x: 4, z: -2.4, shape: 'round' },
  { id: 'M5', label: 'Table 5', area: 'main', minSeats: 3, maxSeats: 6, x: -4, z: 0.4, shape: 'rect', w: 2.2, d: 1 },
  { id: 'M6', label: 'Table 6', area: 'main', minSeats: 3, maxSeats: 6, x: 0, z: 0.4, shape: 'round' },
  { id: 'M7', label: 'Table 7', area: 'main', minSeats: 3, maxSeats: 6, x: 4, z: 0.4, shape: 'rect', w: 2.2, d: 1 },
  { id: 'M8', label: 'Table 8', area: 'main', minSeats: 1, maxSeats: 4, x: -2.2, z: 3, shape: 'round' },
  { id: 'M9', label: 'Table 9', area: 'main', minSeats: 1, maxSeats: 4, x: 2.2, z: 3, shape: 'round' },
  // Window Arcade
  { id: 'W1', label: 'Window 1', area: 'window', minSeats: 1, maxSeats: 2, x: -9, z: 5.8, shape: 'square' },
  { id: 'W2', label: 'Window 2', area: 'window', minSeats: 1, maxSeats: 4, x: -6.6, z: 5.8, shape: 'round' },
  { id: 'W3', label: 'Window 3', area: 'window', minSeats: 1, maxSeats: 2, x: -4.2, z: 5.8, shape: 'square' },
  { id: 'W4', label: 'Window 4', area: 'window', minSeats: 1, maxSeats: 4, x: 5.4, z: 5.8, shape: 'round' },
  { id: 'W5', label: 'Window 5', area: 'window', minSeats: 1, maxSeats: 2, x: 8.4, z: 5.8, shape: 'square' },
  // Chef's Counter (booked as one unit)
  { id: 'CC', label: 'Chef’s Counter', area: 'chefs-counter', minSeats: 2, maxSeats: 8, x: 0, z: -5.5, shape: 'counter', w: 6, d: 0.8 },
  // Private rooms
  { id: 'SN', label: 'Salon Noir', area: 'salon-noir', minSeats: 6, maxSeats: 8, x: -8.75, z: -4.25, shape: 'room', w: 4.5, d: 7.5 },
  { id: 'CR', label: 'Cellar Room', area: 'cellar-room', minSeats: 4, maxSeats: 8, x: 8.75, z: -0.3, shape: 'room', w: 4.5, d: 4.6 },
];

export const tableById = new Map(tables.map((t) => [t.id, t]));
