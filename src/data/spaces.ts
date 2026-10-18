import type { DiningArea } from '@/types';
import type { ImageKey } from './images';

export interface Space {
  id: string;
  name: string;
  kicker: string;
  body: string;
  image: ImageKey;
  materials: string[];
  /** Bookable area this space corresponds to, if any. */
  area?: DiningArea;
  /** Hotspot position on the floor plan (metres). */
  hotspot: { x: number; z: number };
  capacity?: string;
}

export const spaces: Space[] = [
  {
    id: 'facade',
    name: 'The Facade',
    kicker: 'Arrival',
    body: 'Seven travertine arches face the Arcade Royale. At dusk the brass revolving door is the only light on the street — guests are greeted by name before they reach it.',
    image: 'i-arch-facade',
    materials: ['Roman travertine', 'Brushed brass', 'Smoked glass'],
    hotspot: { x: 3.5, z: 7.9 },
  },
  {
    id: 'reception',
    name: 'The Reception',
    kicker: 'Threshold',
    body: 'A monolithic walnut desk beneath a suspended ring of brass and blown glass. Coats are taken, the noise of the city falls away, and the hearth comes into view.',
    image: 'i-chandelier',
    materials: ['Solid walnut', 'Hand-blown glass', 'Brass ring chandelier'],
    hotspot: { x: -1.8, z: 6.6 },
  },
  {
    id: 'main',
    name: 'The Main Dining Room',
    kicker: 'Under the vault',
    body: 'Forty-four seats beneath the original barrel vault of the 1926 bank hall. Oxblood leather banquettes, smoked-oak floors and pools of low, warm light.',
    image: 'i-dining-room',
    materials: ['Barrel-vaulted plaster', 'Oxblood leather', 'Smoked oak'],
    area: 'main',
    hotspot: { x: 0, z: 0.3 },
    capacity: '2–6 guests per table',
  },
  {
    id: 'window',
    name: 'The Window Arcade',
    kicker: 'Evening light',
    body: 'Five tables along floor-to-ceiling arched glazing — the most requested seats in the house for anniversaries and first dates.',
    image: 'i-booth-window',
    materials: ['Arched steel glazing', 'Linen', 'Curved banquettes'],
    area: 'window',
    hotspot: { x: -6.6, z: 5.8 },
    capacity: '2–4 guests per table',
  },
  {
    id: 'hearth',
    name: 'The Hearth & Chef’s Counter',
    kicker: 'Since 1928',
    body: 'The original hearth, rebuilt stone by stone in 1956 and restored in 2026. Eight walnut stools face the fire for the seven-course Chef’s Tasting.',
    image: 'f-hearth',
    materials: ['1928 fire bricks', 'Seasoned oak', 'Walnut counter'],
    area: 'chefs-counter',
    hotspot: { x: 0, z: -6.4 },
    capacity: '2–8 guests, tasting menu only',
  },
  {
    id: 'vault',
    name: 'The Vault',
    kicker: '3,000+ bottles',
    body: 'The bank’s old strongroom, kept at 12°C. Illuminated arched niches hold the cellar’s rarest bottles; the steel door still works.',
    image: 'i-vault-wall',
    materials: ['Strongroom steel', 'Arched niches', 'Oak racking'],
    hotspot: { x: 8.75, z: -5.4 },
  },
  {
    id: 'salon-noir',
    name: 'Salon Noir',
    kicker: 'Private room',
    body: 'Black Marquina marble, a private bar and a single long table. For celebrations that deserve a door that closes.',
    image: 'i-salon-noir',
    materials: ['Nero Marquina marble', 'Lacquered panels', 'Private bar'],
    area: 'salon-noir',
    hotspot: { x: -8.75, z: -4.2 },
    capacity: '6–12 guests',
  },
  {
    id: 'cellar-room',
    name: 'The Cellar Room',
    kicker: 'Inside the vault',
    body: 'A candlelit table for ten inside the Vault itself, surrounded by the bottles you will be drinking.',
    image: 'i-vault-rack',
    materials: ['Vaulted brick', 'Candlelight', 'Oak racking'],
    area: 'cellar-room',
    hotspot: { x: 8.75, z: -0.4 },
    capacity: '4–10 guests',
  },
];
