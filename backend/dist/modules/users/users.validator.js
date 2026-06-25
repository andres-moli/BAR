"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserSchema = exports.createUserSchema = void 0;
const zod_1 = require("zod");
const users_entity_1 = require("./users.entity");
exports.createUserSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email format'),
    password: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
    name: zod_1.z.string().min(1, 'Name is required'),
    role: zod_1.z.nativeEnum(users_entity_1.UserRole, { errorMap: () => ({ message: 'Role must be ADMIN, CASHIER, or WAITER' }) }),
});
exports.updateUserSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email format').optional(),
    name: zod_1.z.string().min(1, 'Name is required').optional(),
    role: zod_1.z.nativeEnum(users_entity_1.UserRole, { errorMap: () => ({ message: 'Role must be ADMIN, CASHIER, or WAITER' }) }).optional(),
    isActive: zod_1.z.boolean().optional(),
});
//# sourceMappingURL=users.validator.js.map