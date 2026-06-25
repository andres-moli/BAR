"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateClientSchema = exports.createClientSchema = void 0;
const zod_1 = require("zod");
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
//# sourceMappingURL=clients.validator.js.map