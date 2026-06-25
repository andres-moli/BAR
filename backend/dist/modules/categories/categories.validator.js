"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCategorySchema = exports.createCategorySchema = void 0;
const zod_1 = require("zod");
exports.createCategorySchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Category name is required'),
    description: zod_1.z.string().optional(),
    icon: zod_1.z.string().optional(),
});
exports.updateCategorySchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Category name is required').optional(),
    description: zod_1.z.string().optional(),
    icon: zod_1.z.string().optional(),
    isActive: zod_1.z.boolean().optional(),
});
//# sourceMappingURL=categories.validator.js.map