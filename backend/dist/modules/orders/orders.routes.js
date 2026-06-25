"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerOrderRoutes = registerOrderRoutes;
const data_source_1 = require("../../database/data-source");
const orders_entity_1 = require("./orders.entity");
const order_item_entity_1 = require("./order-item.entity");
const products_entity_1 = require("../products/products.entity");
const orders_service_1 = require("./orders.service");
const orders_controller_1 = require("./orders.controller");
const middleware_1 = require("../../shared/middleware");
const orders_validator_1 = require("./orders.validator");
function registerOrderRoutes(router) {
    const orderRepo = data_source_1.AppDataSource.getRepository(orders_entity_1.Order);
    const orderItemRepo = data_source_1.AppDataSource.getRepository(order_item_entity_1.OrderItem);
    const productRepo = data_source_1.AppDataSource.getRepository(products_entity_1.Product);
    const ordersService = new orders_service_1.OrdersService(orderRepo, orderItemRepo, productRepo);
    const ordersController = new orders_controller_1.OrderController(ordersService);
    router.get('/', middleware_1.authenticate, ordersController.getAll);
    router.get('/:id', middleware_1.authenticate, ordersController.getById);
    router.post('/', middleware_1.authenticate, (0, middleware_1.validate)(orders_validator_1.createOrderSchema), ordersController.create);
    router.post('/:id/items', middleware_1.authenticate, (0, middleware_1.validate)(orders_validator_1.addItemSchema), ordersController.addItem);
    router.put('/:id/items/:itemId', middleware_1.authenticate, (0, middleware_1.validate)(orders_validator_1.updateItemSchema), ordersController.updateItem);
    router.delete('/:id/items/:itemId', middleware_1.authenticate, ordersController.removeItem);
    router.post('/:id/change-table', middleware_1.authenticate, (0, middleware_1.validate)(orders_validator_1.changeTableSchema), ordersController.changeTable);
    router.post('/:id/split', [middleware_1.authenticate, (0, middleware_1.authorize)('ADMIN'), (0, middleware_1.validate)(orders_validator_1.splitOrderSchema), ordersController.splitOrder]);
    router.get('/:id/history', middleware_1.authenticate, ordersController.getHistory);
}
//# sourceMappingURL=orders.routes.js.map