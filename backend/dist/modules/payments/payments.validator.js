"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processPaymentSchema = void 0;
const zod_1 = require("zod");
exports.processPaymentSchema = zod_1.z.object({
    orderId: zod_1.z.string().uuid('Invalid order ID'),
    amount: zod_1.z.number().positive('Amount must be positive'),
    paymentMethodId: zod_1.z.string().uuid('Invalid payment method ID'),
    reference: zod_1.z.string().max(100).optional(),
    nit: zod_1.z.string().max(20).optional(),
    name: zod_1.z.string().max(200).optional(),
    email: zod_1.z.string().email().optional(),
});
//# sourceMappingURL=payments.validator.js.map