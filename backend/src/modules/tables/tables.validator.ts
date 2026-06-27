import { z } from 'zod';
import { TableStatus } from './tables.entity';

export const createTableSchema = z.object({
  number: z.number().int().positive('Table number must be positive'),
  name: z.string().optional(),
  capacity: z.number().int().positive().optional(),
  location: z.string().optional(),
});

export const updateTableSchema = z.object({
  number: z.number().int().positive().optional(),
  name: z.string().optional(),
  capacity: z.number().int().positive().optional(),
  location: z.string().optional(),
});

export const tableStatusSchema = z.object({
  status: z.nativeEnum(TableStatus, {
    errorMap: () => ({ message: 'Status must be AVAILABLE, OCCUPIED, or RESERVED' }),
  }),
});
