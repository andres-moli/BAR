"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentMethodsService = void 0;
const errors_1 = require("../../shared/errors");
class PaymentMethodsService {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async findAll(includeInactive = false) {
        const where = includeInactive ? {} : { isActive: true };
        return this.repo.find({ where, relations: ['account'], order: { name: 'ASC' } });
    }
    async findById(id) {
        const method = await this.repo.findOne({ where: { id }, relations: ['account'] });
        if (!method)
            throw new errors_1.NotFoundError('Payment method not found');
        return method;
    }
    async getByAccount(accountId) {
        return this.repo.find({ where: { accountId, isActive: true }, order: { name: 'ASC' } });
    }
    async create(data) {
        const existing = await this.repo.findOne({ where: { name: data.name } });
        if (existing)
            throw new errors_1.ConflictError('Payment method with this name already exists');
        const method = this.repo.create(data);
        return this.repo.save(method);
    }
    async update(id, data) {
        const method = await this.findById(id);
        if (data.name && data.name !== method.name) {
            const existing = await this.repo.findOne({ where: { name: data.name } });
            if (existing)
                throw new errors_1.ConflictError('Payment method with this name already exists');
        }
        Object.assign(method, data);
        return this.repo.save(method);
    }
    async delete(id) {
        const method = await this.findById(id);
        await this.repo.remove(method);
    }
}
exports.PaymentMethodsService = PaymentMethodsService;
//# sourceMappingURL=payment-methods.service.js.map