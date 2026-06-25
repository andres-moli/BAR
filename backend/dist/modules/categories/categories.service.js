"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoriesService = void 0;
const errors_1 = require("../../shared/errors");
class CategoriesService {
    categoryRepo;
    constructor(categoryRepo) {
        this.categoryRepo = categoryRepo;
    }
    async findAll() {
        return this.categoryRepo.find({ order: { name: 'ASC' } });
    }
    async findById(id) {
        const category = await this.categoryRepo.findOne({ where: { id } });
        if (!category)
            throw new errors_1.NotFoundError('Category not found');
        return category;
    }
    async create(data) {
        const existing = await this.categoryRepo.findOne({ where: { name: data.name } });
        if (existing)
            throw new errors_1.ConflictError('Category name already exists');
        const category = this.categoryRepo.create(data);
        return this.categoryRepo.save(category);
    }
    async update(id, data) {
        const category = await this.findById(id);
        if (data.name && data.name !== category.name) {
            const existing = await this.categoryRepo.findOne({ where: { name: data.name } });
            if (existing)
                throw new errors_1.ConflictError('Category name already exists');
        }
        Object.assign(category, data);
        return this.categoryRepo.save(category);
    }
    async delete(id) {
        const category = await this.findById(id);
        await this.categoryRepo.remove(category);
    }
}
exports.CategoriesService = CategoriesService;
//# sourceMappingURL=categories.service.js.map