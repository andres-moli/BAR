"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollectionController = void 0;
const wrap = (fn) => (req, res, next) => fn(req, res, next).catch(next);
class CollectionController {
    service;
    constructor(service) {
        this.service = service;
    }
    getAll = wrap(async (req, res) => {
        const collections = await this.service.findAll();
        res.json({ success: true, data: collections });
    });
    getById = wrap(async (req, res) => {
        const collection = await this.service.findById(req.params.id);
        res.json({ success: true, data: collection });
    });
    create = wrap(async (req, res) => {
        const collection = await this.service.create(req.body);
        res.status(201).json({ success: true, data: collection });
    });
    registerPayment = wrap(async (req, res) => {
        const payment = await this.service.registerPayment(req.params.id, req.body);
        res.status(201).json({ success: true, data: payment });
    });
}
exports.CollectionController = CollectionController;
//# sourceMappingURL=collections.controller.js.map