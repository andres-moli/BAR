"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerReportRoutes = registerReportRoutes;
const data_source_1 = require("../../database/data-source");
const orders_entity_1 = require("../orders/orders.entity");
const payments_entity_1 = require("../payments/payments.entity");
const reports_service_1 = require("./reports.service");
const reports_controller_1 = require("./reports.controller");
const middleware_1 = require("../../shared/middleware");
function registerReportRoutes(router) {
    const orderRepo = data_source_1.AppDataSource.getRepository(orders_entity_1.Order);
    const paymentRepo = data_source_1.AppDataSource.getRepository(payments_entity_1.Payment);
    const service = new reports_service_1.ReportsService(orderRepo, paymentRepo);
    const controller = new reports_controller_1.ReportController(service);
    router.get('/sales/day', middleware_1.authenticate, controller.salesByDayHandler);
    router.get('/sales/month', middleware_1.authenticate, controller.salesByMonthHandler);
    router.get('/sales/product', middleware_1.authenticate, controller.salesByProductHandler);
    router.get('/sales/category', middleware_1.authenticate, controller.salesByCategoryHandler);
    router.get('/sales/user', middleware_1.authenticate, controller.salesByUserHandler);
    router.get('/top-products', middleware_1.authenticate, controller.topProductsHandler);
    router.get('/payment-methods', middleware_1.authenticate, controller.paymentMethodsHandler);
    router.get('/collections', middleware_1.authenticate, controller.collectionsHandler);
    router.get('/clients-debt', middleware_1.authenticate, controller.clientsWithDebtHandler);
}
//# sourceMappingURL=reports.routes.js.map