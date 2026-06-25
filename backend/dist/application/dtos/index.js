"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloseCashRegisterDTO = exports.OpenCashRegisterDTO = exports.ReportFilterDTO = exports.UpdateUserDTO = exports.CreateUserDTO = exports.RegisterPaymentDTO = exports.CreateCollectionAccountDTO = exports.UpdateClientDTO = exports.CreateClientDTO = exports.ProcessPaymentDTO = exports.UpdateItemDTO = exports.AddItemDTO = exports.CreateOrderDTO = exports.UpdateProductDTO = exports.CreateProductDTO = exports.UpdatePaymentMethodDTO = exports.CreatePaymentMethodDTO = exports.UpdateAccountDTO = exports.CreateAccountDTO = exports.UpdateCategoryDTO = exports.CreateCategoryDTO = exports.UpdateTableDTO = exports.CreateTableDTO = exports.RegisterDTO = exports.LoginDTO = void 0;
const zod_1 = require("zod");
const index_1 = require("../../domain/value-objects/index");
// ─── Auth DTOs ───────────────────────────────────────────────────────────────
exports.LoginDTO = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email format'),
    password: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
});
exports.RegisterDTO = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email format'),
    password: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
    name: zod_1.z.string().min(2, 'Name must be at least 2 characters'),
    role: zod_1.z.nativeEnum(index_1.UserRole).optional().default(index_1.UserRole.WAITER),
});
// ─── Table DTOs ──────────────────────────────────────────────────────────────
exports.CreateTableDTO = zod_1.z.object({
    number: zod_1.z.number().int().positive('Table number must be positive'),
    capacity: zod_1.z.number().int().positive().optional().default(4),
    location: zod_1.z.string().optional(),
});
exports.UpdateTableDTO = zod_1.z.object({
    number: zod_1.z.number().int().positive().optional(),
    capacity: zod_1.z.number().int().positive().optional(),
    location: zod_1.z.string().optional(),
    status: zod_1.z.nativeEnum(index_1.TableStatus).optional(),
});
// ─── Category DTOs ──────────────────────────────────────────────────────────
exports.CreateCategoryDTO = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Category name is required'),
    description: zod_1.z.string().optional(),
    icon: zod_1.z.string().optional(),
});
exports.UpdateCategoryDTO = zod_1.z.object({
    name: zod_1.z.string().min(1).optional(),
    description: zod_1.z.string().optional().nullable(),
    icon: zod_1.z.string().optional().nullable(),
    isActive: zod_1.z.boolean().optional(),
});
// ─── Account DTOs ──────────────────────────────────────────────────────────
exports.CreateAccountDTO = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Account name is required'),
    type: zod_1.z.nativeEnum(index_1.AccountType).optional().default(index_1.AccountType.CASH),
});
exports.UpdateAccountDTO = zod_1.z.object({
    name: zod_1.z.string().min(1).optional(),
    type: zod_1.z.nativeEnum(index_1.AccountType).optional(),
    isActive: zod_1.z.boolean().optional(),
});
// ─── Payment Method DTOs ────────────────────────────────────────────────────
exports.CreatePaymentMethodDTO = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Payment method name is required'),
    accountId: zod_1.z.string().uuid('Invalid account ID'),
});
exports.UpdatePaymentMethodDTO = zod_1.z.object({
    name: zod_1.z.string().min(1).optional(),
    accountId: zod_1.z.string().uuid().optional(),
    isActive: zod_1.z.boolean().optional(),
});
// ─── Product DTOs ────────────────────────────────────────────────────────────
exports.CreateProductDTO = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Product name is required'),
    description: zod_1.z.string().optional(),
    price: zod_1.z.number().positive('Price must be positive'),
    cost: zod_1.z.number().min(0).optional(),
    categoryId: zod_1.z.string().uuid('Invalid category ID'),
    stock: zod_1.z.number().int().min(0).optional().default(0),
    imageUrl: zod_1.z.string().url().optional().nullable(),
});
exports.UpdateProductDTO = zod_1.z.object({
    name: zod_1.z.string().min(1).optional(),
    description: zod_1.z.string().optional().nullable(),
    price: zod_1.z.number().positive().optional(),
    cost: zod_1.z.number().min(0).optional().nullable(),
    categoryId: zod_1.z.string().uuid().optional(),
    isActive: zod_1.z.boolean().optional(),
    stock: zod_1.z.number().int().min(0).optional(),
    imageUrl: zod_1.z.string().url().optional().nullable(),
});
// ─── Order DTOs ──────────────────────────────────────────────────────────────
exports.CreateOrderDTO = zod_1.z.object({
    tableId: zod_1.z.string().uuid().optional(),
    clientId: zod_1.z.string().uuid().optional(),
    userId: zod_1.z.string().uuid(),
    notes: zod_1.z.string().optional(),
});
exports.AddItemDTO = zod_1.z.object({
    productId: zod_1.z.string().uuid('Invalid product ID'),
    quantity: zod_1.z.number().int().positive('Quantity must be at least 1'),
    notes: zod_1.z.string().optional(),
});
exports.UpdateItemDTO = zod_1.z.object({
    quantity: zod_1.z.number().int().positive().optional(),
    notes: zod_1.z.string().optional().nullable(),
});
// ─── Payment DTOs ────────────────────────────────────────────────────────────
exports.ProcessPaymentDTO = zod_1.z.object({
    orderId: zod_1.z.string().uuid('Invalid order ID'),
    amount: zod_1.z.number().positive('Amount must be positive'),
    paymentMethodId: zod_1.z.string().uuid('Invalid payment method ID'),
    reference: zod_1.z.string().optional(),
    userId: zod_1.z.string().uuid(),
});
// ─── Client DTOs ─────────────────────────────────────────────────────────────
exports.CreateClientDTO = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Client name is required'),
    email: zod_1.z.string().email().optional().nullable(),
    phone: zod_1.z.string().optional().nullable(),
    document: zod_1.z.string().optional().nullable(),
    address: zod_1.z.string().optional().nullable(),
});
exports.UpdateClientDTO = zod_1.z.object({
    name: zod_1.z.string().min(1).optional(),
    email: zod_1.z.string().email().optional().nullable(),
    phone: zod_1.z.string().optional().nullable(),
    document: zod_1.z.string().optional().nullable(),
    address: zod_1.z.string().optional().nullable(),
});
// ─── Collection DTOs ─────────────────────────────────────────────────────────
exports.CreateCollectionAccountDTO = zod_1.z.object({
    totalAmount: zod_1.z.number().positive('Total amount must be positive'),
    clientId: zod_1.z.string().uuid('Invalid client ID'),
    notes: zod_1.z.string().optional(),
    dueDate: zod_1.z.string().datetime().optional(),
});
exports.RegisterPaymentDTO = zod_1.z.object({
    amount: zod_1.z.number().positive('Payment amount must be positive'),
    paymentMethodId: zod_1.z.string().uuid('Invalid payment method ID'),
    reference: zod_1.z.string().optional(),
});
// ─── User DTOs ───────────────────────────────────────────────────────────────
exports.CreateUserDTO = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email format'),
    password: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
    name: zod_1.z.string().min(2, 'Name must be at least 2 characters'),
    role: zod_1.z.nativeEnum(index_1.UserRole),
});
exports.UpdateUserDTO = zod_1.z.object({
    email: zod_1.z.string().email().optional(),
    password: zod_1.z.string().min(6).optional(),
    name: zod_1.z.string().min(2).optional(),
    role: zod_1.z.nativeEnum(index_1.UserRole).optional(),
    isActive: zod_1.z.boolean().optional(),
});
// ─── Report DTOs ─────────────────────────────────────────────────────────────
exports.ReportFilterDTO = zod_1.z.object({
    startDate: zod_1.z.string().datetime().optional(),
    endDate: zod_1.z.string().datetime().optional(),
    userId: zod_1.z.string().uuid().optional(),
    categoryId: zod_1.z.string().uuid().optional(),
    paymentMethodId: zod_1.z.string().uuid().optional(),
});
// ─── Cash Register DTOs ──────────────────────────────────────────────────────
exports.OpenCashRegisterDTO = zod_1.z.object({
    initialAmount: zod_1.z.number().min(0, 'Initial amount must be non-negative'),
    notes: zod_1.z.string().optional(),
});
exports.CloseCashRegisterDTO = zod_1.z.object({
    finalAmount: zod_1.z.number().min(0, 'Final amount must be non-negative'),
    notes: zod_1.z.string().optional(),
});
//# sourceMappingURL=index.js.map