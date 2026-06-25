"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerAuthRoutes = registerAuthRoutes;
const data_source_1 = require("../../database/data-source");
const users_entity_1 = require("../users/users.entity");
const index_1 = require("../../config/index");
const auth_service_1 = require("./auth.service");
const auth_controller_1 = require("./auth.controller");
const middleware_1 = require("../../shared/middleware");
const middleware_2 = require("../../shared/middleware");
const auth_validator_1 = require("./auth.validator");
function registerAuthRoutes(router) {
    const userRepo = data_source_1.AppDataSource.getRepository(users_entity_1.User);
    const authService = new auth_service_1.AuthService(userRepo, index_1.config.jwtSecret, index_1.config.jwtExpiresIn);
    const authController = new auth_controller_1.AuthController(authService);
    router.post('/login', (0, middleware_2.validate)(auth_validator_1.loginSchema), authController.login);
    router.get('/profile', middleware_1.authenticate, authController.getProfile);
    router.put('/profile', middleware_1.authenticate, (0, middleware_2.validate)(auth_validator_1.updateProfileSchema), authController.updateProfile);
}
//# sourceMappingURL=auth.routes.js.map