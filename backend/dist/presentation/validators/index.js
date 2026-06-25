"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeCashRegisterSchema = exports.openCashRegisterSchema = exports.updatePaymentMethodSchema = exports.createPaymentMethodSchema = exports.updateAccountSchema = exports.createAccountSchema = exports.updateCategorySchema = exports.createCategorySchema = exports.printCollectionSchema = exports.printInvoiceSchema = exports.printOrderSchema = exports.salesQuerySchema = exports.updateProfileSchema = exports.updateUserSchema = exports.createUserSchema = exports.registerPaymentSchema = exports.createCollectionSchema = exports.updateClientSchema = exports.createClientSchema = exports.processPaymentSchema = exports.splitOrderSchema = exports.changeTableSchema = exports.updateItemSchema = exports.addItemSchema = exports.createOrderSchema = exports.updateProductSchema = exports.createProductSchema = exports.tableStatusSchema = exports.updateTableSchema = exports.createTableSchema = exports.loginSchema = void 0;
const zod_1 = require("zod");
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email format'),
    password: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
});
exports.createTableSchema = zod_1.z.object({
    number: zod_1.z.number().int().positive('Table number must be positive'),
    capacity: zod_1.z.number().int().positive().optional().default(4),
    location: zod_1.z.string().max(100).optional(),
});
exports.updateTableSchema = zod_1.z.object({
    number: zod_1.z.number().int().positive().optional(),
    capacity: zod_1.z.number().int().positive().optional(),
    location: zod_1.z.string().max(100).optional(),
    status: zod_1.z.enum(['AVAILABLE', 'OCCUPIED', 'RESERVED']).optional(),
});
exports.tableStatusSchema = zod_1.z.object({
    status: zod_1.z.enum(['AVAILABLE', 'OCCUPIED', 'RESERVED']),
});
exports.createProductSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Name is required').max(200),
    description: zod_1.z.string().max(500).optional(),
    price: zod_1.z.number().positive('Price must be positive'),
    cost: zod_1.z.number().min(0).optional(),
    categoryId: zod_1.z.string().uuid('Invalid category ID'),
    stock: zod_1.z.number().int().min(0).optional().default(0),
    imageUrl: zod_1.z.string().url().optional().or(zod_1.z.literal('')),
});
exports.updateProductSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(200).optional(),
    description: zod_1.z.string().max(500).optional(),
    price: zod_1.z.number().positive().optional(),
    cost: zod_1.z.number().min(0).optional(),
    categoryId: zod_1.z.string().uuid().optional(),
    isActive: zod_1.z.boolean().optional(),
    stock: zod_1.z.number().int().min(0).optional(),
    imageUrl: zod_1.z.string().url().optional().or(zod_1.z.literal('')),
});
exports.createOrderSchema = zod_1.z.object({
    tableId: zod_1.z.string().uuid().optional(),
    clientId: zod_1.z.string().uuid().optional(),
    notes: zod_1.z.string().max(500).optional(),
});
exports.addItemSchema = zod_1.z.object({
    productId: zod_1.z.string().uuid('Invalid product ID'),
    quantity: zod_1.z.number().int().positive('Quantity must be positive'),
    notes: zod_1.z.string().max(200).optional(),
});
exports.updateItemSchema = zod_1.z.object({
    quantity: zod_1.z.number().int().positive('Quantity must be positive').optional(),
    notes: zod_1.z.string().max(200).optional(),
});
exports.changeTableSchema = zod_1.z.object({
    tableId: zod_1.z.string().uuid('Invalid table ID'),
});
exports.splitOrderSchema = zod_1.z.object({
    items: zod_1.z.array(zod_1.z.object({
        itemId: zod_1.z.string().uuid(),
        quantity: zod_1.z.number().int().positive(),
    })).min(1, 'At least one item is required'),
    tableId: zod_1.z.string().uuid().optional(),
});
exports.processPaymentSchema = zod_1.z.object({
    orderId: zod_1.z.string().uuid('Invalid order ID'),
    amount: zod_1.z.number().positive('Amount must be positive'),
    paymentMethodId: zod_1.z.string().uuid('Invalid payment method ID'),
    reference: zod_1.z.string().max(100).optional(),
});
exports.createClientSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Name is required').max(200),
    email: zod_1.z.string().email().optional().or(zod_1.z.literal('')),
    phone: zod_1.z.string().max(20).optional(),
    document: zod_1.z.string().max(30).optional(),
    address: zod_1.z.string().max(300).optional(),
});
exports.updateClientSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(200).optional(),
    email: zod_1.z.string().email().optional().or(zod_1.z.literal('')),
    phone: zod_1.z.string().max(20).optional(),
    document: zod_1.z.string().max(30).optional(),
    address: zod_1.z.string().max(300).optional(),
});
exports.createCollectionSchema = zod_1.z.object({
    clientId: zod_1.z.string().uuid('Invalid client ID'),
    totalAmount: zod_1.z.number().positive('Amount must be positive'),
    notes: zod_1.z.string().max(500).optional(),
    dueDate: zod_1.z.string().datetime().optional(),
});
exports.registerPaymentSchema = zod_1.z.object({
    amount: zod_1.z.number().positive('Amount must be positive'),
    paymentMethodId: zod_1.z.string().uuid('Invalid payment method ID'),
    reference: zod_1.z.string().max(100).optional(),
});
exports.createUserSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email format'),
    password: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
    name: zod_1.z.string().min(1, 'Name is required').max(200),
    role: zod_1.z.enum(['ADMIN', 'CASHIER', 'WAITER']),
});
exports.updateUserSchema = zod_1.z.object({
    email: zod_1.z.string().email().optional(),
    name: zod_1.z.string().min(1).max(200).optional(),
    role: zod_1.z.enum(['ADMIN', 'CASHIER', 'WAITER']).optional(),
    isActive: zod_1.z.boolean().optional(),
});
exports.updateProfileSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(200).optional(),
    email: zod_1.z.string().email().optional(),
});
exports.salesQuerySchema = zod_1.z.object({
    startDate: zod_1.z.string().datetime().optional(),
    endDate: zod_1.z.string().datetime().optional(),
});
exports.printOrderSchema = zod_1.z.object({
    orderId: zod_1.z.string().uuid('Invalid order ID'),
});
exports.printInvoiceSchema = zod_1.z.object({
    orderId: zod_1.z.string().uuid('Invalid order ID'),
    nit: zod_1.z.string().max(20).optional(),
    name: zod_1.z.string().max(200).optional(),
    email: zod_1.z.string().email().optional(),
});
exports.printCollectionSchema = zod_1.z.object({
    collectionId: zod_1.z.string().uuid('Invalid collection ID'),
});
// ─── Category Schemas ─────────────────────────────────────────────────────────
exports.createCategorySchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Category name is required').max(100),
    description: zod_1.z.string().max(300).optional(),
    icon: zod_1.z.string().max(50).optional(),
});
exports.updateCategorySchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(100).optional(),
    description: zod_1.z.string().max(300).optional().nullable(),
    icon: zod_1.z.string().max(50).optional().nullable(),
    isActive: zod_1.z.boolean().optional(),
});
// ─── Account Schemas ──────────────────────────────────────────────────────────
exports.createAccountSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Account name is required').max(100),
    type: zod_1.z.enum(['CASH', 'BANK', 'DIGITAL_WALLET', 'OTHER']).optional().default('CASH'),
});
exports.updateAccountSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(100).optional(),
    type: zod_1.z.enum(['CASH', 'BANK', 'DIGITAL_WALLET', 'OTHER']).optional(),
    isActive: zod_1.z.boolean().optional(),
});
// ─── Payment Method Schemas ───────────────────────────────────────────────────
exports.createPaymentMethodSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Payment method name is required').max(100),
    accountId: zod_1.z.string().uuid('Invalid account ID'),
});
exports.updatePaymentMethodSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(100).optional(),
    accountId: zod_1.z.string().uuid().optional(),
    isActive: zod_1.z.boolean().optional(),
});
// ─── Cash Register Schemas ────────────────────────────────────────────────────
exports.openCashRegisterSchema = zod_1.z.object({
    initialAmount: zod_1.z.number().min(0, 'Initial amount must be non-negative'),
    notes: zod_1.z.string().max(300).optional(),
});
exports.closeCashRegisterSchema = zod_1.z.object({
    cashRegisterId: zod_1.z.string().uuid('Invalid cash register ID').optional(),
    finalAmount: zod_1.z.number().min(0, 'Final amount must be non-negative'),
    notes: zod_1.z.string().max(300).optional(),
});
//# sourceMappingURL=index.js.map