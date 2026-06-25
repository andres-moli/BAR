"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CashRegisterService = void 0;
const cash_register_entity_1 = require("./cash-register.entity");
const errors_1 = require("../../shared/errors");
class CashRegisterService {
    repo;
    movementRepo;
    constructor(repo, movementRepo) {
        this.repo = repo;
        this.movementRepo = movementRepo;
    }
    async open(data, userId) {
        const openRegister = await this.repo.findOne({ where: { status: cash_register_entity_1.CashRegisterStatus.OPEN } });
        if (openRegister)
            throw new errors_1.ConflictError('There is already an open cash register');
        const register = this.repo.create({
            initialAmount: data.initialAmount,
            notes: data.notes,
            openedBy: userId,
            status: cash_register_entity_1.CashRegisterStatus.OPEN,
        });
        return this.repo.save(register);
    }
    async close(id, userId) {
        const register = await this.repo.findOne({ where: { id } });
        if (!register)
            throw new errors_1.NotFoundError('Cash register not found');
        if (register.status === cash_register_entity_1.CashRegisterStatus.CLOSED)
            throw new errors_1.ConflictError('Cash register is already closed');
        const movements = await this.movementRepo.find({ where: { cashRegisterId: id } });
        const totalMovements = movements.reduce((sum, m) => sum + Number(m.amount), 0);
        const finalAmount = Number(register.initialAmount) + totalMovements;
        register.finalAmount = finalAmount;
        register.closedBy = userId;
        register.closedAt = new Date();
        register.status = cash_register_entity_1.CashRegisterStatus.CLOSED;
        return this.repo.save(register);
    }
    async getCurrent() {
        return this.repo.findOne({
            where: { status: cash_register_entity_1.CashRegisterStatus.OPEN },
            relations: ['movements'],
        });
    }
    async getMovements(registerId) {
        return this.movementRepo.find({
            where: { cashRegisterId: registerId },
            relations: ['account'],
            order: { createdAt: 'DESC' },
        });
    }
    async getSummary(registerId) {
        const movements = await this.movementRepo.find({
            where: { cashRegisterId: registerId },
            relations: ['account'],
        });
        const grouped = {};
        for (const m of movements) {
            const key = m.accountId;
            if (!grouped[key]) {
                grouped[key] = { accountName: m.account?.name || 'Unknown', totalAmount: 0 };
            }
            grouped[key].totalAmount += Number(m.amount);
        }
        return Object.entries(grouped).map(([accountId, data]) => ({
            accountId,
            accountName: data.accountName,
            totalAmount: data.totalAmount,
        }));
    }
}
exports.CashRegisterService = CashRegisterService;
//# sourceMappingURL=cash-register.service.js.map