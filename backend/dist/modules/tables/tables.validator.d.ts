import { z } from 'zod';
import { TableStatus } from './tables.entity';
export declare const createTableSchema: z.ZodObject<{
    number: z.ZodNumber;
    capacity: z.ZodOptional<z.ZodNumber>;
    location: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    number: number;
    capacity?: number | undefined;
    location?: string | undefined;
}, {
    number: number;
    capacity?: number | undefined;
    location?: string | undefined;
}>;
export declare const updateTableSchema: z.ZodObject<{
    number: z.ZodOptional<z.ZodNumber>;
    capacity: z.ZodOptional<z.ZodNumber>;
    location: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    number?: number | undefined;
    capacity?: number | undefined;
    location?: string | undefined;
}, {
    number?: number | undefined;
    capacity?: number | undefined;
    location?: string | undefined;
}>;
export declare const tableStatusSchema: z.ZodObject<{
    status: z.ZodNativeEnum<typeof TableStatus>;
}, "strip", z.ZodTypeAny, {
    status: TableStatus;
}, {
    status: TableStatus;
}>;
//# sourceMappingURL=tables.validator.d.ts.map