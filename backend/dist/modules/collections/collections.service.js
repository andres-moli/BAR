"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollectionsService = void 0;
const collections_entity_1 = require("./collections.entity");
const errors_1 = require("../../shared/errors");
class CollectionsService {
    repo;
    paymentRepo;
    constructor(repo, paymentRepo) {
        this.repo = repo;
        this.paymentRepo = paymentRepo;
    }
    async findAll() {
        return this.repo.find({ relations: ['client'] });
    }
    async findById(id) {
        const collection = await this.repo.findOne({
            where: { id },
            relations: ['client', 'payments', 'payments.paymentMethod'],
        });
        if (!collection)
            throw new errors_1.NotFoundError('Collection account not found');
        return collection;
    }
    async create(data) {
        const collection = this.repo.create({
            clientId: data.clientId,
            totalAmount: data.totalAmount,
            paidAmount: 0,
            status: collections_entity_1.CollectionStatus.PENDING,
            notes: data.notes,
            dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
        });
        return this.repo.save(collection);
    }
    async registerPayment(id, data) {
        const collection = await this.repo.findOne({ where: { id } });
        if (!collection)
            throw new errors_1.NotFoundError('Collection account not found');
        const payment = this.paymentRepo.create({
            collectionAccountId: id,
            amount: data.amount,
            paymentMethodId: data.paymentMethodId,
            reference: data.reference,
        });
        const saved = await this.paymentRepo.save(payment);
        const totalPaid = Number(collection.paidAmount) + Number(data.amount);
        const totalAmount = Number(collection.totalAmount);
        let newStatus;
        if (totalPaid >= totalAmount) {
            newStatus = collections_entity_1.CollectionStatus.PAID;
        }
        else if (totalPaid > 0) {
            newStatus = collections_entity_1.CollectionStatus.PARTIALLY_PAID;
        }
        else {
            newStatus = collections_entity_1.CollectionStatus.PENDING;
        }
        await this.repo.update(id, { paidAmount: totalPaid, status: newStatus });
        return saved;
    }
    async getHistory(clientId) {
        return this.repo.find({
            where: { clientId },
            relations: ['payments'],
            order: { createdAt: 'DESC' },
        });
    }
}
exports.CollectionsService = CollectionsService;
//# sourceMappingURL=collections.service.js.map