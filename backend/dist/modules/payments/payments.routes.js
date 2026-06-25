"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerPaymentRoutes = registerPaymentRoutes;
const data_source_1 = require("../../database/data-source");
const payments_entity_1 = require("./payments.entity");
const orders_entity_1 = require("../orders/orders.entity");
const invoice_entity_1 = require("./invoice.entity");
const payments_service_1 = require("./payments.service");
const payments_controller_1 = require("./payments.controller");
const middleware_1 = require("../../shared/middleware");
const payments_validator_1 = require("./payments.validator");
function registerPaymentRoutes(router) {
    const paymentRepo = data_source_1.AppDataSource.getRepository(payments_entity_1.Payment);
    const invoiceRepo = data_source_1.AppDataSource.getRepository(invoice_entity_1.Invoice);
    const orderRepo = data_source_1.AppDataSource.getRepository(orders_entity_1.Order);
    const paymentsService = new payments_service_1.PaymentsService(paymentRepo, invoiceRepo, orderRepo);
    const paymentsController = new payments_controller_1.PaymentController(paymentsService);
    router.post('/process', [middleware_1.authenticate, (0, middleware_1.validate)(payments_validator_1.processPaymentSchema), paymentsController.processPayment]);
    router.get('/methods', middleware_1.authenticate, paymentsController.getPaymentMethods);
    router.get('/order/:orderId', middleware_1.authenticate, paymentsController.getByOrder);
}
//# sourceMappingURL=payments.routes.js.map