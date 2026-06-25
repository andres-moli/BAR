import { z } from 'zod';
export declare const createPaymentMethodSchema: z.ZodObject<{
    name: z.ZodString;
    accountId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    accountId: string;
}, {
    name: string;
    accountId: string;
}>;
export declare const updatePaymentMethodSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    accountId: z.ZodOptional<z.ZodString>;
    isActive: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    accountId?: string | undefined;
    isActive?: boolean | undefined;
}, {
    name?: string | undefined;
    accountId?: string | undefined;
    isActive?: boolean | undefined;
}>;
//# sourceMappingURL=payment-methods.validator.d.ts.map