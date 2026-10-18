import type { ImageKey } from './images';

export interface Milestone {
  year: number;
  title: string;
  body: string;
  image: ImageKey;
}

export const timeline: Milestone[] = [
  {
    year: 1928,
    title: 'Le Foyer Royal',
    body: 'Marcel and Élise Varenne open a fourteen-seat grill room in the Old Quarter, built around a single oak-fired hearth. Regulars shorten the name to “Royal” within a year.',
    image: 'f-hearth',
  },
  {
    year: 1956,
    title: 'The bank hall',
    body: 'The family moves into a former 1920s bank hall beneath a barrel-vaulted ceiling. The hearth is dismantled stone by stone and rebuilt; the old strongroom becomes the wine cellar.',
    image: 'i-arcade',
  },
  {
    year: 1989,
    title: 'Hélène’s cellar',
    body: 'Their daughter Hélène builds the Vault to three thousand bottles, introduces the house champagne and writes ROYAL’s first tasting menu by hand.',
    image: 'i-vault-wall',
  },
  {
    year: 2014,
    title: 'The third generation',
    body: 'Adrien Varenne returns after a decade in Kyoto and San Sebastián. He builds a dry-ageing chamber, rethinks the menu around live fire and brings Japanese precision to a French grill room.',
    image: 'p-adrien',
  },
  {
    year: 2026,
    title: 'The Chef’s Counter',
    body: 'Eight seats open in front of the restored 1928 hearth — the room’s oldest object and its newest table.',
    image: 'f-flames',
  },
];

export const pillars = [
  {
    title: 'Fire',
    body: 'Everything that can meet the flame does. Oak for beef, vine cuttings for fish, embers for vegetables. Gas is reserved for the pastry kitchen.',
  },
  {
    title: 'Time',
    body: 'Beef ages 45 to 90 days. Stocks simmer for two. Wines rest for decades. We would rather serve fewer guests than rush a single plate.',
  },
  {
    title: 'Grace',
    body: 'Service should be felt, not seen. Our team learns every regular’s name, every allergy and every anniversary — and never makes a show of it.',
  },
];

export const sourcing = [
  { title: 'Three farms, one standard', body: 'Our beef comes from three heritage-breed farms in Aubrac, Normandy and Galicia, visited by Chef Adrien every spring.' },
  { title: 'Whole animals', body: 'We buy whole carcasses and butcher in-house. Prime cuts reach the hearth; everything else becomes ragù, tartare, stock and charcuterie.' },
  { title: 'Day-boat fish', body: 'Fish arrives from small Atlantic boats each morning. If the sea is rough, the menu changes — not the standard.' },
  { title: 'Fifty kilometres', body: 'Vegetables, herbs and dairy come from within fifty kilometres of Valmont wherever the season allows.' },
];

export const techniques = [
  { title: 'Dry ageing', detail: '45–90 days at 2°C and 80% humidity in a Himalayan-salt chamber.' },
  { title: 'Oak hearth', detail: 'Cooked over seasoned oak at 400°C, then rested on warm stone.' },
  { title: 'Binchotan', detail: 'Japanese white charcoal for wagyu — intense, clean, smokeless heat.' },
  { title: 'The Vault', detail: 'Wines kept at 12°C in the 1956 strongroom, decanted to order.' },
];

export interface TeamMember {
  name: string;
  role: string;
  image: ImageKey;
  bio: string;
  specialties?: string[];
}

export const chef: TeamMember & { philosophy: string; quote: string } = {
  name: 'Adrien Varenne',
  role: 'Executive Chef & third-generation owner',
  image: 'p-adrien',
  bio: 'Born above the dining room in 1984, Adrien left Valmont at nineteen to cook in Lyon, Kyoto and San Sebastián. He returned in 2014 with two convictions: that fire is the most honest way to cook, and that a great restaurant is measured by how its guests feel on the walk home.',
  philosophy:
    'Adrien’s cooking is spare and confident — three or four elements on a plate, each one cooked over the right fuel. He spends more time on resting meat than on garnishes.',
  quote: 'My grandfather gave me a fire. My job is to keep it burning without letting it become a museum.',
  specialties: ['Live-fire cooking', 'Dry-aged beef', 'Seasonal game'],
};

export const team: TeamMember[] = [
  {
    name: 'Kenji Arakawa',
    role: 'Chef de Cuisine',
    image: 'p-kenji',
    bio: 'Trained in Kyoto alongside Adrien. Runs the line, the binchotan grill and the fresh-pasta room.',
    specialties: ['Binchotan', 'Fresh pasta'],
  },
  {
    name: 'Inès Moreau',
    role: 'Pastry Chef',
    image: 'p-ines',
    bio: 'Formerly of three Parisian patisseries. Believes a dessert should surprise the palate once — and only once.',
    specialties: ['Chocolate', 'Plated desserts'],
  },
  {
    name: 'Camille Duret',
    role: 'Head Sommelier',
    image: 'p-camille',
    bio: 'Keeper of the Vault. Tastes every bottle before it reaches a guest and pairs by mood as much as by menu.',
    specialties: ['Burgundy', 'Old vintages'],
  },
  {
    name: 'Amara Diallo',
    role: 'Sous Chef',
    image: 'p-amara',
    bio: 'Leads the dry-ageing programme and the whole-animal butchery that feeds the rest of the menu.',
    specialties: ['Butchery', 'Charcuterie'],
  },
];

export const testimonials = [
  {
    quote: 'They remembered that my father takes his ribeye blue — three years after our last visit.',
    name: 'Élodie R.',
    context: 'Birthday dinner',
  },
  {
    quote: 'The Chef’s Counter is theatre without a single raised voice. We watched the tomahawk rest for twelve minutes and it felt like two.',
    name: 'James & Priya',
    context: 'Chef’s Counter',
  },
  {
    quote: 'Camille poured a 1985 port I didn’t know I needed. The quietest, most generous service I have ever had.',
    name: 'Marco T.',
    context: 'Wine pairing',
  },
  {
    quote: 'Salon Noir for twelve, a menu card with my wife’s name on it, and not one detail we had to ask for twice.',
    name: 'Henrik L.',
    context: 'Private dining',
  },
];

export const accolades = [
  'Three Golden Laurels — Guide Lumière (fictional)',
  'Valmont Table of the Year — La Clé d’Or (fictional)',
  '“The most romantic room in the Old Quarter” — Maison & Table (fictional)',
  'Cellar of Distinction — Wine Spectacle (fictional)',
];
