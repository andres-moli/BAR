"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const errors_1 = require("../../shared/errors");
class AuthService {
    userRepo;
    jwtSecret;
    jwtExpiresIn;
    constructor(userRepo, jwtSecret, jwtExpiresIn = '8h') {
        this.userRepo = userRepo;
        this.jwtSecret = jwtSecret;
        this.jwtExpiresIn = jwtExpiresIn;
    }
    async login(data) {
        const user = await this.userRepo.findOne({ where: { email: data.email } });
        if (!user)
            throw new errors_1.UnauthorizedError('Invalid email or password');
        const isValid = await bcryptjs_1.default.compare(data.password, user.password);
        if (!isValid)
            throw new errors_1.UnauthorizedError('Invalid email or password');
        if (!user.isActive)
            throw new errors_1.UnauthorizedError('Account is disabled');
        const token = this.generateToken(user);
        return {
            token,
            user: { id: user.id, email: user.email, name: user.name, role: user.role },
        };
    }
    async register(data) {
        const existing = await this.userRepo.findOne({ where: { email: data.email } });
        if (existing)
            throw new errors_1.ConflictError('Email already in use');
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashedPassword = await bcryptjs_1.default.hash(data.password, salt);
        const userInput = { email: data.email, password: hashedPassword, name: data.name, role: data.role };
        const user = this.userRepo.create(userInput);
        return this.userRepo.save(user);
    }
    async getProfile(userId) {
        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (!user)
            throw new errors_1.NotFoundError('User not found');
        return user;
    }
    async updateProfile(userId, data) {
        const user = await this.getProfile(userId);
        if (data.email && data.email !== user.email) {
            const existing = await this.userRepo.findOne({ where: { email: data.email } });
            if (existing)
                throw new errors_1.ConflictError('Email already in use');
        }
        Object.assign(user, data);
        return this.userRepo.save(user);
    }
    generateToken(user) {
        const payload = { id: user.id, email: user.email, role: user.role };
        return jsonwebtoken_1.default.sign(payload, this.jwtSecret, { expiresIn: this.jwtExpiresIn });
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map