import { z } from 'zod';
export declare const loginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export declare const createTableSchema: z.ZodObject<{
    number: z.ZodNumber;
    capacity: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    location: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    number: number;
    capacity: number;
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
    status: z.ZodOptional<z.ZodEnum<["AVAILABLE", "OCCUPIED", "RESERVED"]>>;
}, "strip", z.ZodTypeAny, {
    number?: number | undefined;
    capacity?: number | undefined;
    location?: string | undefined;
    status?: "AVAILABLE" | "OCCUPIED" | "RESERVED" | undefined;
}, {
    number?: number | undefined;
    capacity?: number | undefined;
    location?: string | undefined;
    status?: "AVAILABLE" | "OCCUPIED" | "RESERVED" | undefined;
}>;
export declare const tableStatusSchema: z.ZodObject<{
    status: z.ZodEnum<["AVAILABLE", "OCCUPIED", "RESERVED"]>;
}, "strip", z.ZodTypeAny, {
    status: "AVAILABLE" | "OCCUPIED" | "RESERVED";
}, {
    status: "AVAILABLE" | "OCCUPIED" | "RESERVED";
}>;
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
    isActive?: boolean | undefined;
    description?: string | undefined;
    price?: number | undefined;
    cost?: number | undefined;
    categoryId?: string | undefined;
    stock?: number | undefined;
    imageUrl?: string | undefined;
}, {
    name?: string | undefined;
    isActive?: boolean | undefined;
    description?: string | undefined;
    price?: number | undefined;
    cost?: number | undefined;
    categoryId?: string | undefined;
    stock?: number | undefined;
    imageUrl?: string | undefined;
}>;
export declare const createOrderSchema: z.ZodObject<{
    tableId: z.ZodOptional<z.ZodString>;
    clientId: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    notes?: string | undefined;
    tableId?: string | undefined;
    clientId?: string | undefined;
}, {
    notes?: string | undefined;
    tableId?: string | undefined;
    clientId?: string | undefined;
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
export declare const processPaymentSchema: z.ZodObject<{
    orderId: z.ZodString;
    amount: z.ZodNumber;
    paymentMethodId: z.ZodString;
    reference: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    orderId: string;
    paymentMethodId: string;
    amount: number;
    reference?: string | undefined;
}, {
    orderId: string;
    paymentMethodId: string;
    amount: number;
    reference?: string | undefined;
}>;
export declare const createClientSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    phone: z.ZodOptional<z.ZodString>;
    document: z.ZodOptional<z.ZodString>;
    address: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    email?: string | undefined;
    phone?: string | undefined;
    document?: string | undefined;
    address?: string | undefined;
}, {
    name: string;
    email?: string | undefined;
    phone?: string | undefined;
    document?: string | undefined;
    address?: string | undefined;
}>;
export declare const updateClientSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    email: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    phone: z.ZodOptional<z.ZodString>;
    document: z.ZodOptional<z.ZodString>;
    address: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    email?: string | undefined;
    name?: string | undefined;
    phone?: string | undefined;
    document?: string | undefined;
    address?: string | undefined;
}, {
    email?: string | undefined;
    name?: string | undefined;
    phone?: string | undefined;
    document?: string | undefined;
    address?: string | undefined;
}>;
export declare const createCollectionSchema: z.ZodObject<{
    clientId: z.ZodString;
    totalAmount: z.ZodNumber;
    notes: z.ZodOptional<z.ZodString>;
    dueDate: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    clientId: string;
    totalAmount: number;
    notes?: string | undefined;
    dueDate?: string | undefined;
}, {
    clientId: string;
    totalAmount: number;
    notes?: string | undefined;
    dueDate?: string | undefined;
}>;
export declare const registerPaymentSchema: z.ZodObject<{
    amount: z.ZodNumber;
    paymentMethodId: z.ZodString;
    reference: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    paymentMethodId: string;
    amount: number;
    reference?: string | undefined;
}, {
    paymentMethodId: string;
    amount: number;
    reference?: string | undefined;
}>;
export declare const createUserSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    name: z.ZodString;
    role: z.ZodEnum<["ADMIN", "CASHIER", "WAITER"]>;
}, "strip", z.ZodTypeAny, {
    email: string;
    name: string;
    role: "ADMIN" | "CASHIER" | "WAITER";
    password: string;
}, {
    email: string;
    name: string;
    role: "ADMIN" | "CASHIER" | "WAITER";
    password: string;
}>;
export declare const updateUserSchema: z.ZodObject<{
    email: z.ZodOptional<z.ZodString>;
    name: z.ZodOptional<z.ZodString>;
    role: z.ZodOptional<z.ZodEnum<["ADMIN", "CASHIER", "WAITER"]>>;
    isActive: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    email?: string | undefined;
    name?: string | undefined;
    role?: "ADMIN" | "CASHIER" | "WAITER" | undefined;
    isActive?: boolean | undefined;
}, {
    email?: string | undefined;
    name?: string | undefined;
    role?: "ADMIN" | "CASHIER" | "WAITER" | undefined;
    isActive?: boolean | undefined;
}>;
export declare const updateProfileSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    email?: string | undefined;
    name?: string | undefined;
}, {
    email?: string | undefined;
    name?: string | undefined;
}>;
export declare const salesQuerySchema: z.ZodObject<{
    startDate: z.ZodOptional<z.ZodString>;
    endDate: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    startDate?: string | undefined;
    endDate?: string | undefined;
}, {
    startDate?: string | undefined;
    endDate?: string | undefined;
}>;
export declare const printOrderSchema: z.ZodObject<{
    orderId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    orderId: string;
}, {
    orderId: string;
}>;
export declare const printInvoiceSchema: z.ZodObject<{
    orderId: z.ZodString;
    nit: z.ZodOptional<z.ZodString>;
    name: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    orderId: string;
    email?: string | undefined;
    name?: string | undefined;
    nit?: string | undefined;
}, {
    orderId: string;
    email?: string | undefined;
    name?: string | undefined;
    nit?: string | undefined;
}>;
export declare const printCollectionSchema: z.ZodObject<{
    collectionId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    collectionId: string;
}, {
    collectionId: string;
}>;
export declare const createCategorySchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    icon: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    description?: string | undefined;
    icon?: string | undefined;
}, {
    name: string;
    description?: string | undefined;
    icon?: string | undefined;
}>;
export declare const updateCategorySchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    icon: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    isActive: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    isActive?: boolean | undefined;
    description?: string | null | undefined;
    icon?: string | null | undefined;
}, {
    name?: string | undefined;
    isActive?: boolean | undefined;
    description?: string | null | undefined;
    icon?: string | null | undefined;
}>;
export declare const createAccountSchema: z.ZodObject<{
    name: z.ZodString;
    type: z.ZodDefault<z.ZodOptional<z.ZodEnum<["CASH", "BANK", "DIGITAL_WALLET", "OTHER"]>>>;
}, "strip", z.ZodTypeAny, {
    name: string;
    type: "CASH" | "BANK" | "DIGITAL_WALLET" | "OTHER";
}, {
    name: string;
    type?: "CASH" | "BANK" | "DIGITAL_WALLET" | "OTHER" | undefined;
}>;
export declare const updateAccountSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    type: z.ZodOptional<z.ZodEnum<["CASH", "BANK", "DIGITAL_WALLET", "OTHER"]>>;
    isActive: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    isActive?: boolean | undefined;
    type?: "CASH" | "BANK" | "DIGITAL_WALLET" | "OTHER" | undefined;
}, {
    name?: string | undefined;
    isActive?: boolean | undefined;
    type?: "CASH" | "BANK" | "DIGITAL_WALLET" | "OTHER" | undefined;
}>;
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
    isActive?: boolean | undefined;
    accountId?: string | undefined;
}, {
    name?: string | undefined;
    isActive?: boolean | undefined;
    accountId?: string | undefined;
}>;
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
//# sourceMappingURL=index.d.ts.map