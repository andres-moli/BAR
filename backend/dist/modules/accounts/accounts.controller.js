"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountController = void 0;
const wrap = (fn) => (req, res, next) => fn(req, res, next).catch(next);
class AccountController {
    service;
    constructor(service) {
        this.service = service;
    }
    getAll = wrap(async (req, res) => {
        const includeInactive = req.query.includeInactive === 'true';
        const accounts = await this.service.findAll(includeInactive);
        res.json({ success: true, data: accounts });
    });
    getById = wrap(async (req, res) => {
        const account = await this.service.findById(req.params.id);
        res.json({ success: true, data: account });
    });
    create = wrap(async (req, res) => {
        const account = await this.service.create(req.body);
        res.status(201).json({ success: true, data: account });
    });
    update = wrap(async (req, res) => {
        const account = await this.service.update(req.params.id, req.body);
        res.json({ success: true, data: account });
    });
    delete = wrap(async (req, res) => {
        await this.service.delete(req.params.id);
        res.json({ success: true, data: null });
    });
}
exports.AccountController = AccountController;
//# sourceMappingURL=accounts.controller.js.map