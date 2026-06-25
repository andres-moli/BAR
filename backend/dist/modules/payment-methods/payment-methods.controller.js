"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentMethodController = void 0;
const wrap = (fn) => (req, res, next) => fn(req, res, next).catch(next);
class PaymentMethodController {
    service;
    constructor(service) {
        this.service = service;
    }
    getAll = wrap(async (req, res) => {
        const includeInactive = req.query.includeInactive === 'true';
        const methods = await this.service.findAll(includeInactive);
        res.json({ success: true, data: methods });
    });
    getById = wrap(async (req, res) => {
        const method = await this.service.findById(req.params.id);
        res.json({ success: true, data: method });
    });
    getByAccount = wrap(async (req, res) => {
        const methods = await this.service.getByAccount(req.params.accountId);
        res.json({ success: true, data: methods });
    });
    create = wrap(async (req, res) => {
        const method = await this.service.create(req.body);
        res.status(201).json({ success: true, data: method });
    });
    update = wrap(async (req, res) => {
        const method = await this.service.update(req.params.id, req.body);
        res.json({ success: true, data: method });
    });
    delete = wrap(async (req, res) => {
        await this.service.delete(req.params.id);
        res.json({ success: true, data: null });
    });
}
exports.PaymentMethodController = PaymentMethodController;
//# sourceMappingURL=payment-methods.controller.js.map