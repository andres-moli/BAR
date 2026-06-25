"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportController = void 0;
const wrap = (fn) => (req, res, next) => fn(req, res, next).catch(next);
class ReportController {
    service;
    constructor(service) {
        this.service = service;
    }
    salesByDayHandler = wrap(async (req, res) => {
        const startDate = req.query.startDate ? new Date(req.query.startDate) : undefined;
        const endDate = req.query.endDate ? new Date(req.query.endDate) : undefined;
        const data = await this.service.salesByDay(startDate, endDate);
        res.json({ success: true, data });
    });
    salesByMonthHandler = wrap(async (req, res) => {
        const year = req.query.year ? parseInt(req.query.year, 10) : undefined;
        const month = req.query.month ? parseInt(req.query.month, 10) : undefined;
        const data = await this.service.salesByMonth(year, month);
        res.json({ success: true, data });
    });
    salesByProductHandler = wrap(async (req, res) => {
        const startDate = req.query.startDate ? new Date(req.query.startDate) : undefined;
        const endDate = req.query.endDate ? new Date(req.query.endDate) : undefined;
        const data = await this.service.salesByProduct(startDate, endDate);
        res.json({ success: true, data });
    });
    salesByCategoryHandler = wrap(async (req, res) => {
        const startDate = req.query.startDate ? new Date(req.query.startDate) : undefined;
        const endDate = req.query.endDate ? new Date(req.query.endDate) : undefined;
        const data = await this.service.salesByCategory(startDate, endDate);
        res.json({ success: true, data });
    });
    salesByUserHandler = wrap(async (req, res) => {
        const startDate = req.query.startDate ? new Date(req.query.startDate) : undefined;
        const endDate = req.query.endDate ? new Date(req.query.endDate) : undefined;
        const data = await this.service.salesByUser(startDate, endDate);
        res.json({ success: true, data });
    });
    topProductsHandler = wrap(async (req, res) => {
        const limit = req.query.limit ? parseInt(req.query.limit, 10) : 10;
        const startDate = req.query.startDate ? new Date(req.query.startDate) : undefined;
        const endDate = req.query.endDate ? new Date(req.query.endDate) : undefined;
        const data = await this.service.topProducts(limit, startDate, endDate);
        res.json({ success: true, data });
    });
    paymentMethodsHandler = wrap(async (req, res) => {
        const startDate = req.query.startDate ? new Date(req.query.startDate) : undefined;
        const endDate = req.query.endDate ? new Date(req.query.endDate) : undefined;
        const data = await this.service.paymentMethodsReport(startDate, endDate);
        res.json({ success: true, data });
    });
    collectionsHandler = wrap(async (_req, res) => {
        const data = await this.service.collectionsReport();
        res.json({ success: true, data });
    });
    clientsWithDebtHandler = wrap(async (_req, res) => {
        const data = await this.service.clientsWithDebt();
        res.json({ success: true, data });
    });
}
exports.ReportController = ReportController;
//# sourceMappingURL=reports.controller.js.map