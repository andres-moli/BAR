"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerPaymentMethodRoutes = registerPaymentMethodRoutes;
const data_source_1 = require("../../database/data-source");
const payment_methods_entity_1 = require("./payment-methods.entity");
const payment_methods_service_1 = require("./payment-methods.service");
const payment_methods_controller_1 = require("./payment-methods.controller");
const middleware_1 = require("../../shared/middleware");
const middleware_2 = require("../../shared/middleware");
const payment_methods_validator_1 = require("./payment-methods.validator");
function registerPaymentMethodRoutes(router) {
    const repo = data_source_1.AppDataSource.getRepository(payment_methods_entity_1.PaymentMethod);
    const service = new payment_methods_service_1.PaymentMethodsService(repo);
    const controller = new payment_methods_controller_1.PaymentMethodController(service);
    router.get('/', middleware_1.authenticate, controller.getAll);
    router.get('/:id', middleware_1.authenticate, controller.getById);
    router.get('/account/:accountId', middleware_1.authenticate, controller.getByAccount);
    router.post('/', middleware_1.authenticate, (0, middleware_1.authorize)('ADMIN'), (0, middleware_2.validate)(payment_methods_validator_1.createPaymentMethodSchema), controller.create);
    router.put('/:id', middleware_1.authenticate, (0, middleware_1.authorize)('ADMIN'), (0, middleware_2.validate)(payment_methods_validator_1.updatePaymentMethodSchema), controller.update);
    router.delete('/:id', middleware_1.authenticate, (0, middleware_1.authorize)('ADMIN'), controller.delete);
}
//# sourceMappingURL=payment-methods.routes.js.map