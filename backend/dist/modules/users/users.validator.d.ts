import { z } from 'zod';
import { UserRole } from './users.entity';
export declare const createUserSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    name: z.ZodString;
    role: z.ZodNativeEnum<typeof UserRole>;
}, "strip", z.ZodTypeAny, {
    name: string;
    email: string;
    password: string;
    role: UserRole;
}, {
    name: string;
    email: string;
    password: string;
    role: UserRole;
}>;
export declare const updateUserSchema: z.ZodObject<{
    email: z.ZodOptional<z.ZodString>;
    name: z.ZodOptional<z.ZodString>;
    role: z.ZodOptional<z.ZodNativeEnum<typeof UserRole>>;
    isActive: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    isActive?: boolean | undefined;
    email?: string | undefined;
    role?: UserRole | undefined;
}, {
    name?: string | undefined;
    isActive?: boolean | undefined;
    email?: string | undefined;
    role?: UserRole | undefined;
}>;
//# sourceMappingURL=users.validator.d.ts.map