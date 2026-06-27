import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email format').optional(),
  password: z.string().min(6, 'Password must be at least 6 characters').optional(),
  code: z.string().length(4, 'Code must be exactly 4 digits').regex(/^\d{4}$/, 'Code must be 4 digits').optional(),
}).refine(data => (data.email && data.password) || data.code, {
  message: 'Provide email+password or a 4-digit code',
});

export const updateProfileSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  email: z.string().email('Invalid email format').optional(),
});
