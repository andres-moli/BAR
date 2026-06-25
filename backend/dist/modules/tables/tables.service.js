"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TablesService = void 0;
const errors_1 = require("../../shared/errors");
class TablesService {
    tableRepo;
    constructor(tableRepo) {
        this.tableRepo = tableRepo;
    }
    async findAll() {
        return this.tableRepo.find({ order: { number: 'ASC' } });
    }
    async findById(id) {
        const table = await this.tableRepo.findOne({ where: { id } });
        if (!table)
            throw new errors_1.NotFoundError('Table not found');
        return table;
    }
    async create(data) {
        const existing = await this.tableRepo.findOne({ where: { number: data.number } });
        if (existing)
            throw new errors_1.ConflictError('Table number already exists');
        const table = this.tableRepo.create(data);
        return this.tableRepo.save(table);
    }
    async update(id, data) {
        const table = await this.findById(id);
        if (data.number && data.number !== table.number) {
            const existing = await this.tableRepo.findOne({ where: { number: data.number } });
            if (existing)
                throw new errors_1.ConflictError('Table number already exists');
        }
        Object.assign(table, data);
        return this.tableRepo.save(table);
    }
    async delete(id) {
        const table = await this.findById(id);
        await this.tableRepo.remove(table);
    }
    async updateStatus(id, status) {
        const table = await this.findById(id);
        table.status = status;
        return this.tableRepo.save(table);
    }
}
exports.TablesService = TablesService;
//# sourceMappingURL=tables.service.js.map