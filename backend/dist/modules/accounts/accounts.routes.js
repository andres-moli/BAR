"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerAccountRoutes = registerAccountRoutes;
const data_source_1 = require("../../database/data-source");
const accounts_entity_1 = require("./accounts.entity");
const accounts_service_1 = require("./accounts.service");
const accounts_controller_1 = require("./accounts.controller");
const middleware_1 = require("../../shared/middleware");
const middleware_2 = require("../../shared/middleware");
const accounts_validator_1 = require("./accounts.validator");
function registerAccountRoutes(router) {
    const repo = data_source_1.AppDataSource.getRepository(accounts_entity_1.Account);
    const service = new accounts_service_1.AccountsService(repo);
    const controller = new accounts_controller_1.AccountController(service);
    router.get('/', middleware_1.authenticate, controller.getAll);
    router.get('/:id', middleware_1.authenticate, controller.getById);
    router.post('/', middleware_1.authenticate, (0, middleware_1.authorize)('ADMIN'), (0, middleware_2.validate)(accounts_validator_1.createAccountSchema), controller.create);
    router.put('/:id', middleware_1.authenticate, (0, middleware_1.authorize)('ADMIN'), (0, middleware_2.validate)(accounts_validator_1.updateAccountSchema), controller.update);
    router.delete('/:id', middleware_1.authenticate, (0, middleware_1.authorize)('ADMIN'), controller.delete);
}
//# sourceMappingURL=accounts.routes.js.map