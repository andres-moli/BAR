"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerCategoryRoutes = registerCategoryRoutes;
const data_source_1 = require("../../database/data-source");
const categories_entity_1 = require("./categories.entity");
const categories_service_1 = require("./categories.service");
const categories_controller_1 = require("./categories.controller");
const middleware_1 = require("../../shared/middleware");
const middleware_2 = require("../../shared/middleware");
const categories_validator_1 = require("./categories.validator");
function registerCategoryRoutes(router) {
    const categoryRepo = data_source_1.AppDataSource.getRepository(categories_entity_1.Category);
    const categoriesService = new categories_service_1.CategoriesService(categoryRepo);
    const categoriesController = new categories_controller_1.CategoriesController(categoriesService);
    router.get('/', middleware_1.authenticate, categoriesController.getAll);
    router.get('/:id', middleware_1.authenticate, categoriesController.getById);
    router.post('/', middleware_1.authenticate, (0, middleware_1.authorize)('ADMIN'), (0, middleware_2.validate)(categories_validator_1.createCategorySchema), categoriesController.create);
    router.put('/:id', middleware_1.authenticate, (0, middleware_1.authorize)('ADMIN'), (0, middleware_2.validate)(categories_validator_1.updateCategorySchema), categoriesController.update);
    router.delete('/:id', middleware_1.authenticate, (0, middleware_1.authorize)('ADMIN'), categoriesController.delete);
}
//# sourceMappingURL=categories.routes.js.map