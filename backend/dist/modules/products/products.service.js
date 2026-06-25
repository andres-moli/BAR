"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const errors_1 = require("../../shared/errors");
class ProductsService {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async findAll(includeInactive = false) {
        const where = includeInactive ? {} : { isActive: true };
        return this.repo.find({ where, relations: ['category'], order: { name: 'ASC' } });
    }
    async findById(id) {
        const product = await this.repo.findOne({ where: { id }, relations: ['category'] });
        if (!product)
            throw new errors_1.NotFoundError('Product not found');
        return product;
    }
    async create(dto) {
        const product = this.repo.create(dto);
        return this.repo.save(product);
    }
    async update(id, dto) {
        const product = await this.findById(id);
        Object.assign(product, dto);
        return this.repo.save(product);
    }
    async delete(id) {
        const product = await this.findById(id);
        await this.repo.remove(product);
    }
    async findByCategory(categoryId) {
        return this.repo.find({
            where: { categoryId, isActive: true },
            relations: ['category'],
            order: { name: 'ASC' },
        });
    }
}
exports.ProductsService = ProductsService;
//# sourceMappingURL=products.service.js.map