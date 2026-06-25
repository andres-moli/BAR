"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerProductRoutes = registerProductRoutes;
const data_source_1 = require("../../database/data-source");
const products_entity_1 = require("./products.entity");
const products_service_1 = require("./products.service");
const products_controller_1 = require("./products.controller");
const middleware_1 = require("../../shared/middleware");
const products_validator_1 = require("./products.validator");
function registerProductRoutes(router) {
    const productRepo = data_source_1.AppDataSource.getRepository(products_entity_1.Product);
    const productsService = new products_service_1.ProductsService(productRepo);
    const productsController = new products_controller_1.ProductController(productsService);
    router.get('/', middleware_1.authenticate, productsController.getAll);
    router.get('/:id', middleware_1.authenticate, productsController.getById);
    router.post('/', middleware_1.authenticate, (0, middleware_1.authorize)('ADMIN'), (0, middleware_1.validate)(products_validator_1.createProductSchema), productsController.create);
    router.put('/:id', middleware_1.authenticate, (0, middleware_1.authorize)('ADMIN'), (0, middleware_1.validate)(products_validator_1.updateProductSchema), productsController.update);
    router.delete('/:id', middleware_1.authenticate, (0, middleware_1.authorize)('ADMIN'), productsController.delete);
    router.get('/category/:categoryId', middleware_1.authenticate, productsController.getByCategory);
}
//# sourceMappingURL=products.routes.js.map