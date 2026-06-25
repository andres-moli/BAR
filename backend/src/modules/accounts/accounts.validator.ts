import { z } from 'zod';

export const createAccountSchema = z.object({
  name: z.string().min(1, 'Account name is required').max(100),
  type: z.enum(['CASH', 'BANK', 'DIGITAL_WALLET', 'OTHER']).optional().default('CASH'),
});

export const updateAccountSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  type: z.enum(['CASH', 'BANK', 'DIGITAL_WALLET', 'OTHER']).optional(),
  isActive: z.boolean().optional(),
});
