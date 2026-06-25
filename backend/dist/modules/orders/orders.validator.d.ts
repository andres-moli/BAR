import { z } from 'zod';
export declare const createOrderSchema: z.ZodObject<{
    tableId: z.ZodOptional<z.ZodString>;
    clientId: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    notes?: string | undefined;
    clientId?: string | undefined;
    tableId?: string | undefined;
}, {
    notes?: string | undefined;
    clientId?: string | undefined;
    tableId?: string | undefined;
}>;
export declare const addItemSchema: z.ZodObject<{
    productId: z.ZodString;
    quantity: z.ZodNumber;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    quantity: number;
    productId: string;
    notes?: string | undefined;
}, {
    quantity: number;
    productId: string;
    notes?: string | undefined;
}>;
export declare const updateItemSchema: z.ZodObject<{
    quantity: z.ZodOptional<z.ZodNumber>;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    notes?: string | undefined;
    quantity?: number | undefined;
}, {
    notes?: string | undefined;
    quantity?: number | undefined;
}>;
export declare const changeTableSchema: z.ZodObject<{
    tableId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    tableId: string;
}, {
    tableId: string;
}>;
export declare const splitOrderSchema: z.ZodObject<{
    items: z.ZodArray<z.ZodObject<{
        itemId: z.ZodString;
        quantity: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        quantity: number;
        itemId: string;
    }, {
        quantity: number;
        itemId: string;
    }>, "many">;
    tableId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    items: {
        quantity: number;
        itemId: string;
    }[];
    tableId?: string | undefined;
}, {
    items: {
        quantity: number;
        itemId: string;
    }[];
    tableId?: string | undefined;
}>;
//# sourceMappingURL=orders.validator.d.ts.map