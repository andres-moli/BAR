import { z } from 'zod';

export const createPaymentMethodSchema = z.object({
  name: z.string().min(1, 'Payment method name is required').max(100),
  accountId: z.string(),
});

export const updatePaymentMethodSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  accountId: z.string().optional(),
  isActive: z.boolean().optional(),
});
