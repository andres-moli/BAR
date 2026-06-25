"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoriesController = void 0;
const wrap = (fn) => (req, res, next) => {
    return fn(req, res, next).catch(next);
};
class CategoriesController {
    categoriesService;
    constructor(categoriesService) {
        this.categoriesService = categoriesService;
    }
    getAll = wrap(async (_req, res) => {
        const categories = await this.categoriesService.findAll();
        res.json({ success: true, data: categories });
    });
    getById = wrap(async (req, res) => {
        const category = await this.categoriesService.findById(req.params.id);
        res.json({ success: true, data: category });
    });
    create = wrap(async (req, res) => {
        const category = await this.categoriesService.create(req.body);
        res.status(201).json({ success: true, data: category });
    });
    update = wrap(async (req, res) => {
        const category = await this.categoriesService.update(req.params.id, req.body);
        res.json({ success: true, data: category });
    });
    delete = wrap(async (req, res) => {
        await this.categoriesService.delete(req.params.id);
        res.json({ success: true, data: null });
    });
}
exports.CategoriesController = CategoriesController;
//# sourceMappingURL=categories.controller.js.map