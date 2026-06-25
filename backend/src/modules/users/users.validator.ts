import { z } from 'zod';
import { UserRole } from './users.entity';

export const createUserSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(1, 'Name is required'),
  role: z.nativeEnum(UserRole, { errorMap: () => ({ message: 'Role must be ADMIN, CASHIER, or WAITER' }) }),
});

export const updateUserSchema = z.object({
  email: z.string().email('Invalid email format').optional(),
  name: z.string().min(1, 'Name is required').optional(),
  role: z.nativeEnum(UserRole, { errorMap: () => ({ message: 'Role must be ADMIN, CASHIER, or WAITER' }) }).optional(),
  isActive: z.boolean().optional(),
});
