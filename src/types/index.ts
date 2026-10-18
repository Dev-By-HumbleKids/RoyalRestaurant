import type { ImageKey } from '@/data/images';

export type MenuCategory = 'steaks' | 'starters' | 'mains' | 'seafood' | 'pasta' | 'desserts' | 'wine' | 'beverages';

export type DietaryTag = 'vegetarian' | 'gluten-free' | 'dairy-free' | 'contains-nuts';

export type Allergen =
  | 'Dairy'
  | 'Gluten'
  | 'Eggs'
  | 'Fish'
  | 'Crustaceans'
  | 'Molluscs'
  | 'Nuts'
  | 'Sulphites'
  | 'Celery'
  | 'Mustard'
  | 'Soy'
  | 'Sesame';

/** 0–5 scale for each axis. */
export interface FlavorProfile {
  body: number;
  tannin: number;
  acidity: number;
  sweetness: number;
  fruit: number;
  oak: number;
}

export interface SteakDetails {
  cut: string;
  origin: string;
  grade: string;
  agingDays: number;
  weightG: number;
  serves?: number;
}

export interface WineDetails {
  style: 'Champagne' | 'White' | 'Red' | 'Rosé' | 'Sweet' | 'Fortified';
  producer: string;
  region: string;
  varietal: string;
  vintage?: number;
  notes: string;
  glassPrice?: number;
  profile: FlavorProfile;
}

export interface MenuItem {
  id: string;
  slug: string;
  category: MenuCategory;
  name: string;
  description: string;
  story?: string;
  price: number;
  /** e.g. "for two", "per 6", "bottle" */
  priceNote?: string;
  image: ImageKey;
  dietary: DietaryTag[];
  allergens: Allergen[];
  ingredients?: string[];
  chefRecommended?: boolean;
  signature?: boolean;
  pairingIds?: string[];
  steak?: SteakDetails;
  wine?: WineDetails;
}

export type DiningArea = 'main' | 'window' | 'chefs-counter' | 'salon-noir' | 'cellar-room';

export type SlotStatus = 'available' | 'limited' | 'full' | 'closed';

export interface RestaurantTable {
  id: string;
  label: string;
  area: DiningArea;
  minSeats: number;
  maxSeats: number;
  /** Floor-plan coordinates in metres: x → east, z → south. */
  x: number;
  z: number;
  shape: 'round' | 'square' | 'rect' | 'counter' | 'room';
  w?: number;
  d?: number;
}

export type ReservationStatus = 'requested' | 'modified' | 'cancelled';

export interface GuestDetails {
  name: string;
  email: string;
  phone: string;
}

export interface Reservation {
  reference: string;
  status: ReservationStatus;
  date: string; // yyyy-MM-dd
  time: string; // HH:mm
  partySize: number;
  area: DiningArea;
  tableId: string;
  guest: GuestDetails;
  occasion?: string;
  dietary?: string;
  requests?: string;
  wishlist?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TimeSlot {
  time: string;
  service: 'lunch' | 'dinner';
  status: SlotStatus;
  /** Tables that fit the party and are still free. */
  freeTables: number;
  fittingTables: number;
  reason?: string;
}

export interface DayAvailability {
  date: string;
  status: SlotStatus;
  reason?: string;
}

export interface TableAvailability {
  table: RestaurantTable;
  status: 'free' | 'booked' | 'unsuitable';
}
