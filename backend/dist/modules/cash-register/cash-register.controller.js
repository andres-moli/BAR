"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CashRegisterController = void 0;
const wrap = (fn) => (req, res, next) => fn(req, res, next).catch(next);
class CashRegisterController {
    service;
    constructor(service) {
        this.service = service;
    }
    open = wrap(async (req, res) => {
        const register = await this.service.open(req.body, req.user.id);
        res.status(201).json({ success: true, data: register });
    });
    close = wrap(async (req, res) => {
        const id = req.params.id || req.body.cashRegisterId;
        const register = await this.service.close(id, req.user.id);
        res.json({ success: true, data: register });
    });
    getCurrent = wrap(async (_req, res) => {
        const register = await this.service.getCurrent();
        res.json({ success: true, data: register });
    });
    getMovements = wrap(async (req, res) => {
        const id = req.params.id || req.query.cashRegisterId;
        const movements = await this.service.getMovements(id);
        res.json({ success: true, data: movements });
    });
    getSummary = wrap(async (req, res) => {
        const id = req.params.id || req.query.cashRegisterId;
        const summary = await this.service.getSummary(id);
        res.json({ success: true, data: summary });
    });
}
exports.CashRegisterController = CashRegisterController;
//# sourceMappingURL=cash-register.controller.js.map