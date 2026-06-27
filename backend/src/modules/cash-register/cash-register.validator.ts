import { z } from 'zod';

export const openCashRegisterSchema = z.object({
  initialAmount: z.number().min(0, 'Initial amount must be non-negative'),
  notes: z.string().max(300).optional(),
});

export const closeCashRegisterSchema = z.object({
  cashRegisterId: z.string().optional(),
  notes: z.string().max(300).optional(),
});
