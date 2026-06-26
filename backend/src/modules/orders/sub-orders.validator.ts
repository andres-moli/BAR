import { z } from 'zod';

export const createSubOrderSchema = z.object({
  orderId: z.string(),
});

export const deliverSubOrderSchema = z.object({});
