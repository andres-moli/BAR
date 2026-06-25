"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = validate;
const zod_1 = require("zod");
function validate(schema, target = 'body') {
    return (req, res, next) => {
        try {
            const parsed = schema.parse(req[target]);
            req[target] = parsed;
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const fields = {};
                for (const issue of error.issues) {
                    const path = issue.path.join('.');
                    if (!fields[path])
                        fields[path] = [];
                    fields[path].push(issue.message);
                }
                res.status(400).json({
                    success: false,
                    error: {
                        message: 'Validation failed',
                        code: 'ValidationError',
                        details: fields,
                    },
                });
                return;
            }
            next(error);
        }
    };
}
//# sourceMappingURL=validate.js.map