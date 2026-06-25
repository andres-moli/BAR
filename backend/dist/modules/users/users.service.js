"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const errors_1 = require("../../shared/errors");
class UsersService {
    userRepo;
    constructor(userRepo) {
        this.userRepo = userRepo;
    }
    async findAll() {
        return this.userRepo.find();
    }
    async findById(id) {
        const user = await this.userRepo.findOne({ where: { id } });
        if (!user)
            throw new errors_1.NotFoundError('User not found');
        return user;
    }
    async create(data) {
        const existing = await this.userRepo.findOne({ where: { email: data.email } });
        if (existing)
            throw new errors_1.ConflictError('Email already in use');
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashedPassword = await bcryptjs_1.default.hash(data.password, salt);
        const user = this.userRepo.create({ ...data, password: hashedPassword });
        return this.userRepo.save(user);
    }
    async update(id, data) {
        const user = await this.findById(id);
        if (data.email && data.email !== user.email) {
            const existing = await this.userRepo.findOne({ where: { email: data.email } });
            if (existing)
                throw new errors_1.ConflictError('Email already in use');
        }
        Object.assign(user, data);
        return this.userRepo.save(user);
    }
    async delete(id) {
        const user = await this.findById(id);
        await this.userRepo.remove(user);
    }
}
exports.UsersService = UsersService;
//# sourceMappingURL=users.service.js.map