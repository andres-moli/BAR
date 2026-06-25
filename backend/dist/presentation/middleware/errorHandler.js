"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const AppError_1 = require("../../shared/errors/AppError");
const index_1 = require("../../infrastructure/logging/index");
const errorStatusMap = {
    NotFoundError: 404,
    ValidationError: 400,
    UnauthorizedError: 401,
    ForbiddenError: 403,
    ConflictError: 409,
};
function errorHandler(err, req, res, _next) {
    if (err instanceof AppError_1.AppError) {
        const response = {
            success: false,
            error: {
                message: err.message,
                code: err.constructor.name,
            },
        };
        if (err instanceof AppError_1.ValidationError && err.fields) {
            response.error.details = err.fields;
        }
        res.status(err.statusCode).json(response);
        return;
    }
    const statusCode = errorStatusMap[err.constructor.name] || 500;
    index_1.logger.error(`Unhandled error on ${req.method} ${req.path}`, {
        error: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });
    const response = {
        success: false,
        error: {
            message: statusCode === 500 ? 'Internal server error' : err.message,
            code: err.constructor.name,
        },
    };
    res.status(statusCode).json(response);
}
//# sourceMappingURL=errorHandler.js.map