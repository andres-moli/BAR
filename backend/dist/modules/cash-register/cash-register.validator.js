"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeCashRegisterSchema = exports.openCashRegisterSchema = void 0;
const zod_1 = require("zod");
exports.openCashRegisterSchema = zod_1.z.object({
    initialAmount: zod_1.z.number().min(0, 'Initial amount must be non-negative'),
    notes: zod_1.z.string().max(300).optional(),
});
exports.closeCashRegisterSchema = zod_1.z.object({
    cashRegisterId: zod_1.z.string().uuid('Invalid cash register ID').optional(),
    finalAmount: zod_1.z.number().min(0, 'Final amount must be non-negative'),
    notes: zod_1.z.string().max(300).optional(),
});
//# sourceMappingURL=cash-register.validator.js.map