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
    body: 'Henri Varenne, a cook from Lyon, and Daw Khin Mya, who ran the room and the books, open a fourteen-seat grill house in a narrow downtown shophouse near the river. Its one luxury is a brick hearth fed with tamarind wood. Within a year, regulars simply say they are going “to Royal.”',
    image: 'f-hearth',
  },
  {
    year: 1956,
    title: 'The bank hall',
    body: 'The family moves into a 1926 bank hall with a barrel-vaulted ceiling. The hearth is taken apart brick by brick and rebuilt beneath the vault, and the old strongroom becomes the wine cellar.',
    image: 'i-arcade',
  },
  {
    year: 1989,
    title: 'Hélène’s cellar',
    body: 'Their daughter, Hélène Khin Varenne, builds the Vault to three thousand bottles and writes ROYAL’s first tasting menu. It pairs French technique with a Burmese pantry: tamarind, Shan tea leaf, river prawns and jaggery.',
    image: 'i-vault-wall',
  },
  {
    year: 2014,
    title: 'The third generation',
    body: 'Adrien Thant Varenne comes home after ten years in Kyoto and San Sebastián. He builds a dry-ageing chamber, puts live fire at the centre of the menu, and brings seafood from the Myeik Archipelago and produce from the Shan highlands to the table.',
    image: 'p-adrien',
  },
  {
    year: 2026,
    title: 'The Chef’s Counter',
    body: 'Eight teak stools open in front of the restored 1928 hearth: the oldest object in the room becomes its newest table.',
    image: 'f-flames',
  },
];

export const pillars = [
  {
    title: 'Fire',
    body: 'Everything that can meet the flame does. Tamarind wood for beef, charcoal for seafood, embers for vegetables. Gas is kept for the pastry kitchen.',
  },
  {
    title: 'Time',
    body: 'Beef ages 45 to 90 days. Stocks simmer for two. Wines rest for decades. We would rather serve fewer guests than rush a single plate.',
  },
  {
    title: 'Grace',
    body: 'Burmese hospitality, French service. A quiet “Mingalaba” at the door, your name remembered, every allergy and anniversary noted, and never any fuss about it.',
  },
];

export const sourcing = [
  { title: 'Myeik Archipelago', body: 'Lobster, crab, scallops and line-caught fish arrive from small Andaman day boats. If the sea is rough, the menu changes, not the standard.' },
  { title: 'The Shan highlands', body: 'Tea leaf, heirloom tomatoes, avocados and cool-climate vegetables come from family farms around Inle and the Shan hills.' },
  { title: 'Three farms, one standard', body: 'Beef comes from heritage-breed farms in Kagoshima, Normandy and Galicia, chosen in person by Chef Adrien and aged in our own chamber.' },
  { title: 'Whole animals', body: 'We butcher in-house. Prime cuts go to the hearth; everything else becomes ragù, tartare, stock and charcuterie.' },
];

export const techniques = [
  { title: 'Dry ageing', detail: '45–90 days at 2°C and 80% humidity in a Himalayan-salt chamber, even in Yangon’s heat.' },
  { title: 'Tamarind-wood hearth', detail: 'Cooked over seasoned tamarind wood at 400°C, then rested on warm brick.' },
  { title: 'Binchotan', detail: 'Japanese white charcoal for wagyu: intense, clean, smokeless heat.' },
  { title: 'The Vault', detail: 'Wines kept at 12°C inside the 1926 strongroom while the city outside sits at 35°C.' },
];

export interface TeamMember {
  name: string;
  role: string;
  image: ImageKey;
  bio: string;
  specialties?: string[];
}

export const chef: TeamMember & { philosophy: string; quote: string } = {
  name: 'Adrien Thant Varenne',
  role: 'Executive Chef & third-generation owner',
  image: 'p-adrien',
  bio: 'Born above the dining room in 1984 to a French father and a Yangon mother, Adrien left at nineteen to cook in Kyoto and San Sebastián. He came home in 2014 with two convictions: fire is the most honest way to cook, and a great restaurant is measured by how its guests feel on the walk home along the river.',
  philosophy:
    'Adrien cooks with restraint and confidence: three or four elements on a plate, each over the right fuel, often with one Burmese note such as tamarind, tea leaf or palm sugar. He spends more time resting meat than garnishing it.',
  quote: 'My great-grandparents gave me a fire. My job is to keep it burning without turning it into a museum.',
  specialties: ['Live-fire cooking', 'Dry-aged beef', 'Burmese–French pantry'],
};

export const team: TeamMember[] = [
  {
    name: 'Ko Kyaw Zin Htet',
    role: 'Chef de Cuisine',
    image: 'p-kyaw',
    bio: 'Born in Yangon and raised behind his mother’s mohinga stall in Ahlone, Kyaw cooked in Bangkok and Singapore before joining ROYAL in 2016. He has run the kitchen since 2022 and leads the Burmese–French dishes: the mohinga velouté, the tea-leaf burrata and every tamarind glaze.',
    specialties: ['Burmese–French cuisine', 'Broths & curry pastes'],
  },
  {
    name: 'Ma Ei Mon',
    role: 'Pastry Sous Chef',
    image: 'p-eimon',
    bio: 'From Mandalay, where she learned to cook toddy-palm jaggery with her grandmother. Ei Mon reimagines Myanmar sweets such as sanwin makin, shwe yin aye and mont lone yay paw as plated fine-dining desserts.',
    specialties: ['Jaggery & palm sugar', 'Myanmar sweets, reimagined'],
  },
  {
    name: 'Kenji Arakawa',
    role: 'Grill Chef',
    image: 'p-kenji',
    bio: 'Trained in Kyoto alongside Adrien and moved to Yangon in 2015. He commands the binchotan grill and the fresh-pasta room.',
    specialties: ['Binchotan', 'Fresh pasta'],
  },
  {
    name: 'Inès Moreau',
    role: 'Pastry Chef',
    image: 'p-ines',
    bio: 'Formerly of three Parisian patisseries. She runs the pastry kitchen with Ei Mon, French restraint meeting Burmese sweetness, and believes a dessert should surprise the palate once, and only once.',
    specialties: ['Chocolate', 'Viennoiserie'],
  },
  {
    name: 'Camille Duret',
    role: 'Head Sommelier',
    image: 'p-camille',
    bio: 'Keeper of the Vault. She tastes every bottle before it reaches a guest, and pairs as much by mood and monsoon as by menu.',
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
    quote: 'They remembered that my father takes his ribeye blue, three years after our last visit.',
    name: 'Thiri M.',
    context: 'Birthday dinner',
  },
  {
    quote: 'The Chef’s Counter is theatre without a single raised voice. We watched the tomahawk rest for twelve minutes and it felt like two.',
    name: 'James & Priya',
    context: 'Chef’s Counter',
  },
  {
    quote: 'Camille poured a 1985 port I didn’t know I needed while the rain came down outside. The quietest, most generous service I have ever had.',
    name: 'Marco T.',
    context: 'Wine pairing',
  },
  {
    quote: 'Salon Noir for twelve, a menu card with my mother’s name in Myanmar and English, and not one detail we had to ask for twice.',
    name: 'Ko Zaw H.',
    context: 'Private dining',
  },
];

export const accolades = [
  'Three Golden Laurels — Guide Lumière Asia (fictional)',
  'Yangon Table of the Year — La Clé d’Or (fictional)',
  '“The most romantic room in downtown Yangon” — Maison & Table (fictional)',
  'Cellar of Distinction — Wine Spectacle (fictional)',
];
