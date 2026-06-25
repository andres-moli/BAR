"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerPaymentSchema = exports.createCollectionSchema = void 0;
const zod_1 = require("zod");
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
//# sourceMappingURL=collections.validator.js.map