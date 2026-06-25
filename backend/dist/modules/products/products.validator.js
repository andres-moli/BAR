"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProductSchema = exports.createProductSchema = void 0;
const zod_1 = require("zod");
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
//# sourceMappingURL=products.validator.js.map