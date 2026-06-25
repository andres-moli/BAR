"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderController = void 0;
const wrap = (fn) => (req, res, next) => fn(req, res, next).catch(next);
class OrderController {
    service;
    constructor(service) {
        this.service = service;
    }
    getAll = wrap(async (req, res) => {
        const filters = {};
        if (req.query.status)
            filters.status = req.query.status;
        if (req.query.tableId)
            filters.tableId = req.query.tableId;
        if (req.query.userId)
            filters.userId = req.query.userId;
        if (req.query.clientId)
            filters.clientId = req.query.clientId;
        if (req.query.startDate)
            filters.startDate = new Date(req.query.startDate);
        if (req.query.endDate)
            filters.endDate = new Date(req.query.endDate);
        const orders = await this.service.findAll(filters);
        res.json({ success: true, data: orders });
    });
    getById = wrap(async (req, res) => {
        const order = await this.service.findById(req.params.id);
        res.json({ success: true, data: order });
    });
    create = wrap(async (req, res) => {
        const order = await this.service.create({ ...req.body, userId: req.user.id });
        res.status(201).json({ success: true, data: order });
    });
    addItem = wrap(async (req, res) => {
        const item = await this.service.addItem(req.params.id, { ...req.body, userId: req.user.id });
        res.status(201).json({ success: true, data: item });
    });
    updateItem = wrap(async (req, res) => {
        const item = await this.service.updateItem(req.params.itemId, req.body);
        res.json({ success: true, data: item });
    });
    removeItem = wrap(async (req, res) => {
        await this.service.removeItem(req.params.itemId);
        res.json({ success: true, data: null });
    });
    changeTable = wrap(async (req, res) => {
        const order = await this.service.changeTable(req.params.id, req.body.tableId);
        res.json({ success: true, data: order });
    });
    splitOrder = wrap(async (req, res) => {
        const newOrder = await this.service.splitOrder(req.params.id, req.body);
        res.status(201).json({ success: true, data: newOrder });
    });
    getHistory = wrap(async (req, res) => {
        const history = await this.service.getHistory(req.params.id);
        res.json({ success: true, data: history });
    });
}
exports.OrderController = OrderController;
//# sourceMappingURL=orders.controller.js.map