import { z } from 'zod';
export declare const openCashRegisterSchema: z.ZodObject<{
    initialAmount: z.ZodNumber;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    initialAmount: number;
    notes?: string | undefined;
}, {
    initialAmount: number;
    notes?: string | undefined;
}>;
export declare const closeCashRegisterSchema: z.ZodObject<{
    cashRegisterId: z.ZodOptional<z.ZodString>;
    finalAmount: z.ZodNumber;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    finalAmount: number;
    notes?: string | undefined;
    cashRegisterId?: string | undefined;
}, {
    finalAmount: number;
    notes?: string | undefined;
    cashRegisterId?: string | undefined;
}>;
//# sourceMappingURL=cash-register.validator.d.ts.map