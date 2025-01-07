import { z } from 'zod';

export const passengerSchema = z.object({
  full_name: z.string().min(1, 'Full name is required').regex(/^[a-zA-Z\s]+$/, 'Name must contain only letters and spaces'),    
  email: z.string().email('Invalid email').optional(),
  phone: z
    .string()
    .regex(/^\+\d{10,}$/, 'Phone number must start with "+" followed by at least 10 digits'),
  birthdate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Birthdate must be in YYYY-MM-DD format').optional(),
  age: z.number().min(0),
  price: z.number(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});


export const registerSchema = z.object({
  fullName: z.string().min(1, 'Full name is required').regex(/^[a-zA-Z\s]+$/, 'Name must contain only letters and spaces'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  confirmPassword: z.string().min(6, 'Confirm password must be at least 6 characters long'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords don\'t match',
  path: ['confirmPassword'],
});