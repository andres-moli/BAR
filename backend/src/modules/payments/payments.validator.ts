import { z } from 'zod';

export const processPaymentSchema = z.object({
  orderId: z.string(),
  amount: z.number().positive('Amount must be positive'),
  paymentMethodId: z.string(),
  reference: z.string().max(100).optional(),
  nit: z.string().max(20).optional(),
  name: z.string().max(200).optional(),
  email: z.string().email().optional(),
});
