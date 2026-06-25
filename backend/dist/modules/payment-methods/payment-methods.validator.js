"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePaymentMethodSchema = exports.createPaymentMethodSchema = void 0;
const zod_1 = require("zod");
exports.createPaymentMethodSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Payment method name is required').max(100),
    accountId: zod_1.z.string().uuid('Invalid account ID'),
});
exports.updatePaymentMethodSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(100).optional(),
    accountId: zod_1.z.string().uuid().optional(),
    isActive: zod_1.z.boolean().optional(),
});
//# sourceMappingURL=payment-methods.validator.js.map