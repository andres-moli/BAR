import { z } from 'zod';

export const createClientSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().max(20).optional(),
  document: z.string().max(30).optional(),
  address: z.string().max(300).optional(),
});

export const updateClientSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().max(20).optional(),
  document: z.string().max(30).optional(),
  address: z.string().max(300).optional(),
});
