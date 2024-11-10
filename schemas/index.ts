import { z } from 'zod'

export const passengerSchema = z.object({
    full_name: z.string().min(1, 'Full name is required').regex(/^[a-zA-Z\s]+$/, 'Name must contain only letters and spaces'),    
    email: z.string().email('Invalid email').optional(),
    phone: z.string().min(10, 'Phone number must be at least 10 digits').optional(),
    birthdate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Birthdate must be in YYYY-MM-DD format').optional(),
    age: z.number().min(0),
    price: z.number(),
  });