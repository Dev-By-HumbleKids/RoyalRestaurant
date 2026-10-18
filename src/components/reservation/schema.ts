import { z } from 'zod';

// Messages are dictionary keys (t.validation.*); `Field` translates them for display.
export const detailsSchema = z.object({
  name: z.string().trim().min(2, 'name').max(80, 'nameLong'),
  email: z.string().trim().email('email'),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9\s().-]{7,20}$/, 'phone'),
  occasion: z.string(),
  dietary: z.string().max(200, 'max200'),
  requests: z.string().max(500, 'max500'),
  attachWishlist: z.boolean(),
});
