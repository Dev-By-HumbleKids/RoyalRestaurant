/** Brand facts. ROYAL is fictional — every value here is invented for a portfolio demo. */
export const site = {
  name: 'ROYAL',
  tagline: 'Fire, Time & Grace.',
  established: 1928,
  statement:
    'A fine-dining house in the Old Quarter of Valmont, built around an oak-fired hearth that has burned since 1928.',
  address: { line1: '1 Arcade Royale', line2: 'Old Quarter', city: 'Valmont' },
  phone: '+00 000 000 1928',
  phoneHref: 'tel:+000000001928',
  email: 'reservations@royal.example',
  timezoneLabel: 'Valmont time (CET)',
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
