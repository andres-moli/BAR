"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientController = void 0;
const wrap = (fn) => (req, res, next) => fn(req, res, next).catch(next);
class ClientController {
    service;
    constructor(service) {
        this.service = service;
    }
    getAll = wrap(async (_req, res) => {
        const clients = await this.service.findAll();
        res.json({ success: true, data: clients });
    });
    getById = wrap(async (req, res) => {
        const client = await this.service.findById(req.params.id);
        res.json({ success: true, data: client });
    });
    create = wrap(async (req, res) => {
        const client = await this.service.create(req.body);
        res.status(201).json({ success: true, data: client });
    });
    update = wrap(async (req, res) => {
        const client = await this.service.update(req.params.id, req.body);
        res.json({ success: true, data: client });
    });
    delete = wrap(async (req, res) => {
        await this.service.delete(req.params.id);
        res.json({ success: true, data: null });
    });
    getHistory = wrap(async (req, res) => {
        const history = await this.service.getHistory(req.params.id);
        res.json({ success: true, data: history });
    });
}
exports.ClientController = ClientController;
//# sourceMappingURL=clients.controller.js.map