"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
const wrap = (fn) => (req, res, next) => fn(req, res, next).catch(next);
class ProductController {
    service;
    constructor(service) {
        this.service = service;
    }
    getAll = wrap(async (req, res) => {
        const includeInactive = req.query.includeInactive === 'true';
        const products = await this.service.findAll(includeInactive);
        res.json({ success: true, data: products });
    });
    getById = wrap(async (req, res) => {
        const product = await this.service.findById(req.params.id);
        res.json({ success: true, data: product });
    });
    create = wrap(async (req, res) => {
        const product = await this.service.create(req.body);
        res.status(201).json({ success: true, data: product });
    });
    update = wrap(async (req, res) => {
        const product = await this.service.update(req.params.id, req.body);
        res.json({ success: true, data: product });
    });
    delete = wrap(async (req, res) => {
        await this.service.delete(req.params.id);
        res.json({ success: true, data: null });
    });
    getByCategory = wrap(async (req, res) => {
        const products = await this.service.findByCategory(req.params.categoryId);
        res.json({ success: true, data: products });
    });
}
exports.ProductController = ProductController;
//# sourceMappingURL=products.controller.js.map