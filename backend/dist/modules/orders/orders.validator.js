"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.splitOrderSchema = exports.changeTableSchema = exports.updateItemSchema = exports.addItemSchema = exports.createOrderSchema = void 0;
const zod_1 = require("zod");
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
//# sourceMappingURL=orders.validator.js.map