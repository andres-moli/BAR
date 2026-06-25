"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUserRoutes = registerUserRoutes;
const data_source_1 = require("../../database/data-source");
const users_entity_1 = require("./users.entity");
const users_service_1 = require("./users.service");
const users_controller_1 = require("./users.controller");
const middleware_1 = require("../../shared/middleware");
const middleware_2 = require("../../shared/middleware");
const users_validator_1 = require("./users.validator");
function registerUserRoutes(router) {
    const userRepo = data_source_1.AppDataSource.getRepository(users_entity_1.User);
    const usersService = new users_service_1.UsersService(userRepo);
    const usersController = new users_controller_1.UsersController(usersService);
    router.get('/', middleware_1.authenticate, (0, middleware_1.authorize)('ADMIN'), usersController.getAll);
    router.get('/:id', middleware_1.authenticate, (0, middleware_1.authorize)('ADMIN'), usersController.getById);
    router.post('/', middleware_1.authenticate, (0, middleware_1.authorize)('ADMIN'), (0, middleware_2.validate)(users_validator_1.createUserSchema), usersController.create);
    router.put('/:id', middleware_1.authenticate, (0, middleware_1.authorize)('ADMIN'), (0, middleware_2.validate)(users_validator_1.updateUserSchema), usersController.update);
    router.delete('/:id', middleware_1.authenticate, (0, middleware_1.authorize)('ADMIN'), usersController.delete);
}
//# sourceMappingURL=users.routes.js.map