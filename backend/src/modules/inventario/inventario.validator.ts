import { z } from 'zod';

export const createMovementSchema = z.object({
  productId: z.string(),
  type: z.enum(['ENTRY', 'EXIT', 'ADJUSTMENT'], { required_error: 'Tipo de movimiento requerido' }),
  quantity: z.number().int().positive('La cantidad debe ser un entero positivo'),
  description: z.string().max(500).optional(),
});

export const adjustStockSchema = z.object({
  quantity: z.number().int('Debe ser un entero'),
  description: z.string().max(500).optional(),
});
