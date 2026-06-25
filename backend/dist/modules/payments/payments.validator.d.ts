import { z } from 'zod';
export declare const processPaymentSchema: z.ZodObject<{
    orderId: z.ZodString;
    amount: z.ZodNumber;
    paymentMethodId: z.ZodString;
    reference: z.ZodOptional<z.ZodString>;
    nit: z.ZodOptional<z.ZodString>;
    name: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    amount: number;
    paymentMethodId: string;
    orderId: string;
    name?: string | undefined;
    reference?: string | undefined;
    email?: string | undefined;
    nit?: string | undefined;
}, {
    amount: number;
    paymentMethodId: string;
    orderId: string;
    name?: string | undefined;
    reference?: string | undefined;
    email?: string | undefined;
    nit?: string | undefined;
}>;
//# sourceMappingURL=payments.validator.d.ts.map