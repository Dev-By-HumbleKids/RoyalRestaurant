import type { DiningArea } from '@/types';
import type { ImageKey } from './images';

export interface Experience {
  id: string;
  name: string;
  kicker: string;
  body: string;
  image: ImageKey;
  price: string;
  duration: string;
  party: string;
  /** Visual identity accent for the card. */
  tone: 'ember' | 'champagne' | 'burgundy' | 'ivory' | 'noir' | 'gold';
  action:
    | { kind: 'reserve'; label: string; area?: DiningArea; occasion?: string; note?: string }
    | { kind: 'inquire'; label: string };
}

export const experiences: Experience[] = [
  {
    id: 'signature-dining',
    name: 'Signature Dining',
    kicker: 'À la carte',
    body: 'The full menu in the Main Dining Room or the Window Arcade — from a single steak and a glass of Côte-Rôtie to a long evening of everything.',
    image: 'i-dining-dark',
    price: 'Average €140 per guest',
    duration: '2 – 2½ hours',
    party: '1 – 8 guests',
    tone: 'champagne',
    action: { kind: 'reserve', label: 'Reserve a table', area: 'main' },
  },
  {
    id: 'chefs-tasting',
    name: 'Chef’s Tasting',
    kicker: 'At the Chef’s Counter',
    body: 'Seven courses cooked in front of you on the 1928 hearth, narrated by Chef Adrien and his team.',
    image: 'f-flames',
    price: '€245 per guest',
    duration: '3 hours',
    party: '2 – 8 guests',
    tone: 'ember',
    action: { kind: 'reserve', label: 'Reserve the counter', area: 'chefs-counter' },
  },
  {
    id: 'wine-pairing',
    name: 'Wine Pairing',
    kicker: 'With Camille Duret',
    body: 'A glass for every course, drawn from the Vault. The Prestige pairing opens bottles older than most of our guests.',
    image: 'w-champagne-curtain',
    price: '+€165 · Prestige +€390',
    duration: 'Alongside your menu',
    party: 'Any table',
    tone: 'burgundy',
    action: { kind: 'reserve', label: 'Add to a reservation', note: 'We would like the wine pairing.' },
  },
  {
    id: 'private-dining',
    name: 'Private Dining',
    kicker: 'Salon Noir & the Cellar Room',
    body: 'Two rooms with doors that close: black marble and a private bar, or a candlelit table inside the Vault.',
    image: 'i-salon-noir',
    price: 'From €2,400 minimum spend',
    duration: 'Your evening, your pace',
    party: '6 – 12 guests',
    tone: 'noir',
    action: { kind: 'reserve', label: 'Book a private room', area: 'salon-noir' },
  },
  {
    id: 'celebrations',
    name: 'Special Celebrations',
    kicker: 'Anniversaries, proposals, milestones',
    body: 'A menu card with your names, champagne on arrival, a cake from Inès and, if you wish, a ring hidden with the petits fours.',
    image: 'w-champagne-tower',
    price: 'From €60 supplement',
    duration: 'Arranged with you in advance',
    party: '2 – 8 guests',
    tone: 'gold',
    action: { kind: 'reserve', label: 'Plan a celebration', occasion: 'Anniversary' },
  },
  {
    id: 'exclusive',
    name: 'Exclusive Occasions',
    kicker: 'The whole house',
    body: 'Full buy-out of ROYAL for up to ninety guests — weddings, launches and dinners that need the entire hall.',
    image: 'i-chandelier-crystal',
    price: 'On request',
    duration: 'Lunch or evening',
    party: '20 – 90 guests',
    tone: 'ivory',
    action: { kind: 'inquire', label: 'Send an inquiry' },
  },
];

export const tastingCourses = [
  { n: 1, name: 'Oyster', detail: 'Frozen champagne mignonette, rye', image: 'st-oyster' as ImageKey },
  { n: 2, name: 'Scallop', detail: 'Brown butter, cauliflower, golden raisin', image: 'sf-scallop' as ImageKey },
  { n: 3, name: 'Tagliolini', detail: 'Black Périgord truffle, aged Parmigiano', image: 'pa-truffle' as ImageKey },
  { n: 4, name: 'Turbot', detail: 'Vine-cutting grill, beurre blanc, caviar', image: 'sf-turbot' as ImageKey },
  { n: 5, name: 'Wagyu A5', detail: 'Binchotan, bone-marrow jus, wasabi', image: 's-wagyu' as ImageKey },
  { n: 6, name: 'The Trolley', detail: 'Three cheeses chosen at the counter', image: 'd-cheese' as ImageKey },
  { n: 7, name: 'Chocolate', detail: 'Guanaja, bergamot, smoked salt', image: 'd-tart' as ImageKey },
];

export const galleryCategories = ['All', 'Architecture', 'Interiors', 'Steaks', 'Kitchen', 'Wine', 'Private dining', 'Evenings'] as const;
export type GalleryCategory = (typeof galleryCategories)[number];

export const gallery: { image: ImageKey; category: Exclude<GalleryCategory, 'All'>; caption: string }[] = [
  { image: 'i-arch-facade', category: 'Architecture', caption: 'Seven arches on the Arcade Royale' },
  { image: 'i-dining-room', category: 'Interiors', caption: 'The Main Dining Room after dark' },
  { image: 's-tomahawk', category: 'Steaks', caption: 'Tomahawk over oak' },
  { image: 'c-plating-2', category: 'Kitchen', caption: 'Plating at the pass' },
  { image: 'i-vault-wall', category: 'Wine', caption: 'Inside the Vault' },
  { image: 'i-salon-noir', category: 'Private dining', caption: 'Salon Noir' },
  { image: 'i-candle-table', category: 'Evenings', caption: 'Last table of the night' },
  { image: 'i-arcade', category: 'Architecture', caption: 'The barrel vault, 1926' },
  { image: 'i-chandelier', category: 'Interiors', caption: 'The reception chandelier' },
  { image: 's-a5', category: 'Steaks', caption: 'A5 marbling, Kagoshima' },
  { image: 'f-hearth', category: 'Kitchen', caption: 'The 1928 hearth' },
  { image: 'w-champagne-tower', category: 'Wine', caption: 'House champagne, poured for a celebration' },
  { image: 'i-chandelier-hall', category: 'Private dining', caption: 'The Cellar Room corridor' },
  { image: 'i-bar-warm', category: 'Evenings', caption: 'The walnut bar' },
  { image: 'i-stone-arches', category: 'Architecture', caption: 'Morning shadows in the courtyard' },
  { image: 'i-booth-window', category: 'Interiors', caption: 'The Window Arcade' },
  { image: 's-ribeye', category: 'Steaks', caption: 'Heritage ribeye, carved' },
  { image: 'c-plating', category: 'Kitchen', caption: 'Herbs from the Valmont hills' },
  { image: 'c-pour', category: 'Wine', caption: 'Côte-Rôtie, decanted' },
  { image: 'i-candle-blur', category: 'Evenings', caption: 'Candlelight in the Vault' },
];
