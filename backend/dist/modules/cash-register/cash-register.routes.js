"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerCashRegisterRoutes = registerCashRegisterRoutes;
const data_source_1 = require("../../database/data-source");
const cash_register_entity_1 = require("./cash-register.entity");
const cash_movement_entity_1 = require("./cash-movement.entity");
const cash_register_service_1 = require("./cash-register.service");
const cash_register_controller_1 = require("./cash-register.controller");
const middleware_1 = require("../../shared/middleware");
const middleware_2 = require("../../shared/middleware");
const cash_register_validator_1 = require("./cash-register.validator");
function registerCashRegisterRoutes(router) {
    const repo = data_source_1.AppDataSource.getRepository(cash_register_entity_1.CashRegister);
    const movementRepo = data_source_1.AppDataSource.getRepository(cash_movement_entity_1.CashMovement);
    const service = new cash_register_service_1.CashRegisterService(repo, movementRepo);
    const controller = new cash_register_controller_1.CashRegisterController(service);
    router.post('/open', middleware_1.authenticate, (0, middleware_1.authorize)('ADMIN'), (0, middleware_2.validate)(cash_register_validator_1.openCashRegisterSchema), controller.open);
    router.post('/close', middleware_1.authenticate, (0, middleware_1.authorize)('ADMIN'), (0, middleware_2.validate)(cash_register_validator_1.closeCashRegisterSchema), controller.close);
    router.get('/current', middleware_1.authenticate, controller.getCurrent);
    router.get('/:id/movements', middleware_1.authenticate, controller.getMovements);
    router.get('/:id/summary', middleware_1.authenticate, controller.getSummary);
}
//# sourceMappingURL=cash-register.routes.js.map