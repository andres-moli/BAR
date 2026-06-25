"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
exports.authorize = authorize;
const index_1 = require("../../infrastructure/auth/index");
function authenticate(req, res, next) {
    const token = index_1.authService.extractTokenFromRequest(req);
    if (!token) {
        res.status(401).json({ success: false, error: { message: 'Authentication required', code: 'UnauthorizedError' } });
        return;
    }
    try {
        const payload = index_1.authService.verifyToken(token);
        req.user = payload;
        next();
    }
    catch {
        res.status(401).json({ success: false, error: { message: 'Invalid or expired token', code: 'UnauthorizedError' } });
    }
}
function authorize(...allowedRoles) {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({ success: false, error: { message: 'Authentication required', code: 'UnauthorizedError' } });
            return;
        }
        if (!allowedRoles.includes(req.user.role)) {
            res.status(403).json({ success: false, error: { message: 'Insufficient permissions', code: 'ForbiddenError' } });
            return;
        }
        next();
    };
}
//# sourceMappingURL=auth.js.map