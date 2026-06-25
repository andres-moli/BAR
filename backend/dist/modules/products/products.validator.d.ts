import { z } from 'zod';
export declare const createProductSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    price: z.ZodNumber;
    cost: z.ZodOptional<z.ZodNumber>;
    categoryId: z.ZodString;
    stock: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    imageUrl: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
}, "strip", z.ZodTypeAny, {
    name: string;
    price: number;
    categoryId: string;
    stock: number;
    description?: string | undefined;
    cost?: number | undefined;
    imageUrl?: string | undefined;
}, {
    name: string;
    price: number;
    categoryId: string;
    description?: string | undefined;
    cost?: number | undefined;
    stock?: number | undefined;
    imageUrl?: string | undefined;
}>;
export declare const updateProductSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    price: z.ZodOptional<z.ZodNumber>;
    cost: z.ZodOptional<z.ZodNumber>;
    categoryId: z.ZodOptional<z.ZodString>;
    isActive: z.ZodOptional<z.ZodBoolean>;
    stock: z.ZodOptional<z.ZodNumber>;
    imageUrl: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    description?: string | undefined;
    isActive?: boolean | undefined;
    price?: number | undefined;
    cost?: number | undefined;
    categoryId?: string | undefined;
    stock?: number | undefined;
    imageUrl?: string | undefined;
}, {
    name?: string | undefined;
    description?: string | undefined;
    isActive?: boolean | undefined;
    price?: number | undefined;
    cost?: number | undefined;
    categoryId?: string | undefined;
    stock?: number | undefined;
    imageUrl?: string | undefined;
}>;
//# sourceMappingURL=products.validator.d.ts.map