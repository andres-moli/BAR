import { z } from 'zod';
export declare const createAccountSchema: z.ZodObject<{
    name: z.ZodString;
    type: z.ZodDefault<z.ZodOptional<z.ZodEnum<["CASH", "BANK", "DIGITAL_WALLET", "OTHER"]>>>;
}, "strip", z.ZodTypeAny, {
    type: "CASH" | "BANK" | "DIGITAL_WALLET" | "OTHER";
    name: string;
}, {
    name: string;
    type?: "CASH" | "BANK" | "DIGITAL_WALLET" | "OTHER" | undefined;
}>;
export declare const updateAccountSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    type: z.ZodOptional<z.ZodEnum<["CASH", "BANK", "DIGITAL_WALLET", "OTHER"]>>;
    isActive: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    type?: "CASH" | "BANK" | "DIGITAL_WALLET" | "OTHER" | undefined;
    name?: string | undefined;
    isActive?: boolean | undefined;
}, {
    type?: "CASH" | "BANK" | "DIGITAL_WALLET" | "OTHER" | undefined;
    name?: string | undefined;
    isActive?: boolean | undefined;
}>;
//# sourceMappingURL=accounts.validator.d.ts.map