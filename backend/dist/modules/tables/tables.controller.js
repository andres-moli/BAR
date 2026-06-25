"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TablesController = void 0;
const wrap = (fn) => (req, res, next) => {
    return fn(req, res, next).catch(next);
};
class TablesController {
    tablesService;
    constructor(tablesService) {
        this.tablesService = tablesService;
    }
    getAll = wrap(async (_req, res) => {
        const tables = await this.tablesService.findAll();
        res.json({ success: true, data: tables });
    });
    getById = wrap(async (req, res) => {
        const table = await this.tablesService.findById(req.params.id);
        res.json({ success: true, data: table });
    });
    create = wrap(async (req, res) => {
        const table = await this.tablesService.create(req.body);
        res.status(201).json({ success: true, data: table });
    });
    update = wrap(async (req, res) => {
        const table = await this.tablesService.update(req.params.id, req.body);
        res.json({ success: true, data: table });
    });
    delete = wrap(async (req, res) => {
        await this.tablesService.delete(req.params.id);
        res.json({ success: true, data: null });
    });
    updateStatus = wrap(async (req, res) => {
        const table = await this.tablesService.updateStatus(req.params.id, req.body.status);
        res.json({ success: true, data: table });
    });
}
exports.TablesController = TablesController;
//# sourceMappingURL=tables.controller.js.map