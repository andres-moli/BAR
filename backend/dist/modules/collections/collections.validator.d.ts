import { z } from 'zod';
export declare const createCollectionSchema: z.ZodObject<{
    clientId: z.ZodString;
    totalAmount: z.ZodNumber;
    notes: z.ZodOptional<z.ZodString>;
    dueDate: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    totalAmount: number;
    clientId: string;
    notes?: string | undefined;
    dueDate?: string | undefined;
}, {
    totalAmount: number;
    clientId: string;
    notes?: string | undefined;
    dueDate?: string | undefined;
}>;
export declare const registerPaymentSchema: z.ZodObject<{
    amount: z.ZodNumber;
    paymentMethodId: z.ZodString;
    reference: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    amount: number;
    paymentMethodId: string;
    reference?: string | undefined;
}, {
    amount: number;
    paymentMethodId: string;
    reference?: string | undefined;
}>;
//# sourceMappingURL=collections.validator.d.ts.map