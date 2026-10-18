/** Brand facts. ROYAL is fictional — every value here is invented for a portfolio demo. */
export const site = {
  name: 'ROYAL',
  tagline: 'Fire, Time & Grace.',
  established: 1928,
  statement:
    'An international fine-dining house in downtown Yangon, built around a tamarind-wood hearth that has burned since 1928.',
  // A fictional address in a real city. The "0" after +95 makes the number deliberately invalid.
  address: { line1: '1 Royal Arcade', line2: 'Downtown Heritage Quarter', city: 'Yangon' },
  phone: '+95 0 000 1928',
  phoneHref: 'tel:+9500001928',
  email: 'reservations@royal.example',
  timezoneLabel: 'Yangon time (MMT)',
  hours: [
    { days: 'Tuesday – Thursday', times: 'Dinner 18:00 – 23:00' },
    { days: 'Friday – Sunday', times: 'Lunch 12:00 – 14:30 · Dinner 18:00 – 23:00' },
    { days: 'Monday', times: 'Closed — the hearth rests' },
  ],
  socials: [
    { label: 'Instagram', href: 'https://www.instagram.com/' },
    { label: 'Pinterest', href: 'https://www.pinterest.com/' },
    { label: 'Vimeo', href: 'https://vimeo.com/' },
  ],
  nav: [
    { label: 'Home', to: '/' },
    { label: 'Our Story', to: '/story' },
    { label: 'Menu', to: '/menu' },
    { label: 'Experience', to: '/experience' },
    { label: 'Reservations', to: '/reservations' },
    { label: 'Contact', to: '/contact' },
  ],
} as const;
