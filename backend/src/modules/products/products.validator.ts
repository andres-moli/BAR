import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  description: z.string().max(500).optional(),
  price: z.number().positive('Price must be positive'),
  cost: z.number().min(0).optional(),
  categoryId: z.string(),
  stock: z.number().int().min(0).optional().default(0),
  imageUrl: z.string().url().optional().or(z.literal('')),
});

export const updateProductSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  description: z.string().max(500).optional(),
  price: z.number().positive().optional(),
  cost: z.number().min(0).optional(),
  categoryId: z.string().optional(),
  isActive: z.boolean().optional(),
  stock: z.number().int().min(0).optional(),
  imageUrl: z.string().url().optional().or(z.literal('')),
});
