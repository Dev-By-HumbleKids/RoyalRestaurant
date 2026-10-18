import { z } from 'zod';

export const detailsSchema = z.object({
  name: z.string().trim().min(2, 'Please enter your full name.').max(80, 'That name is a little long.'),
  email: z.string().trim().email('Please enter a valid email address.'),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9\s().-]{7,20}$/, 'Please enter a valid phone number, e.g. +44 20 7946 0000.'),
  occasion: z.string(),
  dietary: z.string().max(200, 'Please keep this under 200 characters.'),
  requests: z.string().max(500, 'Please keep this under 500 characters.'),
  attachWishlist: z.boolean(),
});
