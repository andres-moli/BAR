"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientsService = void 0;
const errors_1 = require("../../shared/errors");
class ClientsService {
    repo;
    orderRepo;
    collectionRepo;
    constructor(repo, orderRepo, collectionRepo) {
        this.repo = repo;
        this.orderRepo = orderRepo;
        this.collectionRepo = collectionRepo;
    }
    async findAll() {
        return this.repo.find({ order: { name: 'ASC' } });
    }
    async findById(id) {
        const client = await this.repo.findOne({ where: { id } });
        if (!client)
            throw new errors_1.NotFoundError('Client not found');
        return client;
    }
    async create(dto) {
        const client = this.repo.create(dto);
        return this.repo.save(client);
    }
    async update(id, dto) {
        const client = await this.findById(id);
        Object.assign(client, dto);
        return this.repo.save(client);
    }
    async delete(id) {
        const client = await this.findById(id);
        await this.repo.remove(client);
    }
    async getHistory(id) {
        const client = await this.findById(id);
        const orders = await this.orderRepo.find({
            where: { clientId: id },
            relations: ['items', 'items.product', 'payments'],
            order: { createdAt: 'DESC' },
        });
        const collectionAccounts = await this.collectionRepo.find({
            where: { clientId: id },
            relations: ['payments'],
            order: { createdAt: 'DESC' },
        });
        return { client, orders, collectionAccounts };
    }
}
exports.ClientsService = ClientsService;
//# sourceMappingURL=clients.service.js.map