"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAccountSchema = exports.createAccountSchema = void 0;
const zod_1 = require("zod");
exports.createAccountSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Account name is required').max(100),
    type: zod_1.z.enum(['CASH', 'BANK', 'DIGITAL_WALLET', 'OTHER']).optional().default('CASH'),
});
exports.updateAccountSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(100).optional(),
    type: zod_1.z.enum(['CASH', 'BANK', 'DIGITAL_WALLET', 'OTHER']).optional(),
    isActive: zod_1.z.boolean().optional(),
});
//# sourceMappingURL=accounts.validator.js.map