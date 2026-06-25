"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = exports.AuthService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const index_1 = require("../../config/index");
class AuthService {
    jwtSecret;
    jwtExpiresIn;
    saltRounds;
    constructor() {
        this.jwtSecret = index_1.config.jwtSecret;
        this.jwtExpiresIn = index_1.config.jwtExpiresIn;
        this.saltRounds = 12;
    }
    generateToken(payload) {
        const options = { expiresIn: this.jwtExpiresIn };
        return jsonwebtoken_1.default.sign(payload, this.jwtSecret, options);
    }
    verifyToken(token) {
        return jsonwebtoken_1.default.verify(token, this.jwtSecret);
    }
    async hashPassword(password) {
        return bcryptjs_1.default.hash(password, this.saltRounds);
    }
    async comparePasswords(password, hash) {
        return bcryptjs_1.default.compare(password, hash);
    }
    extractTokenFromRequest(req) {
        const authHeader = req.headers.authorization;
        if (!authHeader)
            return null;
        const parts = authHeader.split(' ');
        if (parts.length !== 2 || parts[0] !== 'Bearer')
            return null;
        return parts[1];
    }
    getCurrentUser(req) {
        const token = this.extractTokenFromRequest(req);
        if (!token)
            return null;
        try {
            return this.verifyToken(token);
        }
        catch {
            return null;
        }
    }
}
exports.AuthService = AuthService;
exports.authService = new AuthService();
//# sourceMappingURL=index.js.map