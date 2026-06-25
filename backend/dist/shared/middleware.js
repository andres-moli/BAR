"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.validate = exports.authorize = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const index_1 = require("../config/index");
const errors_1 = require("./errors");
const zod_1 = require("zod");
const authenticate = (req, _res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(new errors_1.UnauthorizedError('No token provided'));
    }
    try {
        const token = authHeader.split(' ')[1];
        const decoded = jsonwebtoken_1.default.verify(token, index_1.config.jwtSecret);
        req.user = decoded;
        next();
    }
    catch {
        next(new errors_1.UnauthorizedError('Invalid or expired token'));
    }
};
exports.authenticate = authenticate;
const authorize = (...roles) => (req, _res, next) => {
    if (!req.user)
        return next(new errors_1.UnauthorizedError());
    if (!roles.includes(req.user.role)) {
        return next(new errors_1.ForbiddenError('Insufficient permissions'));
    }
    next();
};
exports.authorize = authorize;
const validate = (schema, source = 'body') => (req, _res, next) => {
    try {
        const data = schema.parse(req[source]);
        req[source] = data;
        next();
    }
    catch (err) {
        if (err instanceof zod_1.ZodError) {
            return next(new (require('./errors').ValidationError)('Validation failed', err.errors));
        }
        next(err);
    }
};
exports.validate = validate;
const errorHandler = (err, _req, res, _next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal server error';
    const details = err.details;
    if (statusCode === 500)
        console.error('ERROR:', err);
    res.status(statusCode).json({
        success: false,
        error: { message, code: err.name, ...(details && { details }) },
    });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=middleware.js.map