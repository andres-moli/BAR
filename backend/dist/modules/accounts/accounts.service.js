"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountsService = void 0;
const errors_1 = require("../../shared/errors");
class AccountsService {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async findAll(includeInactive = false) {
        const where = includeInactive ? {} : { isActive: true };
        return this.repo.find({ where, order: { name: 'ASC' } });
    }
    async findById(id) {
        const account = await this.repo.findOne({ where: { id } });
        if (!account)
            throw new errors_1.NotFoundError('Account not found');
        return account;
    }
    async create(data) {
        const existing = await this.repo.findOne({ where: { name: data.name } });
        if (existing)
            throw new errors_1.ConflictError('Account with this name already exists');
        const account = this.repo.create(data);
        return this.repo.save(account);
    }
    async update(id, data) {
        const account = await this.findById(id);
        if (data.name && data.name !== account.name) {
            const existing = await this.repo.findOne({ where: { name: data.name } });
            if (existing)
                throw new errors_1.ConflictError('Account with this name already exists');
        }
        Object.assign(account, data);
        return this.repo.save(account);
    }
    async delete(id) {
        const account = await this.findById(id);
        await this.repo.remove(account);
    }
}
exports.AccountsService = AccountsService;
//# sourceMappingURL=accounts.service.js.map