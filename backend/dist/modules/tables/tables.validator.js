"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tableStatusSchema = exports.updateTableSchema = exports.createTableSchema = void 0;
const zod_1 = require("zod");
const tables_entity_1 = require("./tables.entity");
exports.createTableSchema = zod_1.z.object({
    number: zod_1.z.number().int().positive('Table number must be positive'),
    capacity: zod_1.z.number().int().positive().optional(),
    location: zod_1.z.string().optional(),
});
exports.updateTableSchema = zod_1.z.object({
    number: zod_1.z.number().int().positive().optional(),
    capacity: zod_1.z.number().int().positive().optional(),
    location: zod_1.z.string().optional(),
});
exports.tableStatusSchema = zod_1.z.object({
    status: zod_1.z.nativeEnum(tables_entity_1.TableStatus, {
        errorMap: () => ({ message: 'Status must be AVAILABLE, OCCUPIED, or RESERVED' }),
    }),
});
//# sourceMappingURL=tables.validator.js.map