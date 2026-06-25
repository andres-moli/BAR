import { z } from 'zod';

export const createOrderSchema = z.object({
  tableId: z.string().optional(),
  clientId: z.string().optional(),
  notes: z.string().max(500).optional(),
});

export const addItemSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().positive('Quantity must be positive'),
  notes: z.string().max(200).optional(),
});

export const updateItemSchema = z.object({
  quantity: z.number().int().positive('Quantity must be positive').optional(),
  notes: z.string().max(200).optional(),
});

export const changeTableSchema = z.object({
  tableId: z.string(),
});

export const splitOrderSchema = z.object({
  items: z.array(z.object({
    itemId: z.string(),
    quantity: z.number().int().positive(),
  })).min(1, 'At least one item is required'),
  tableId: z.string().optional(),
});
