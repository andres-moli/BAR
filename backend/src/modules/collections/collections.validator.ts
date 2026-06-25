import { z } from 'zod';

export const createCollectionSchema = z.object({
  clientId: z.string(),
  totalAmount: z.number().positive('Amount must be positive'),
  notes: z.string().max(500).optional(),
  dueDate: z.string().datetime().optional(),
});

export const registerPaymentSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  paymentMethodId: z.string(),
  reference: z.string().max(100).optional(),
});
