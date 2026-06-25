"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerClientRoutes = registerClientRoutes;
const data_source_1 = require("../../database/data-source");
const clients_entity_1 = require("./clients.entity");
const orders_entity_1 = require("../orders/orders.entity");
const collections_entity_1 = require("../collections/collections.entity");
const clients_service_1 = require("./clients.service");
const clients_controller_1 = require("./clients.controller");
const middleware_1 = require("../../shared/middleware");
const clients_validator_1 = require("./clients.validator");
function registerClientRoutes(router) {
    const clientRepo = data_source_1.AppDataSource.getRepository(clients_entity_1.Client);
    const orderRepo = data_source_1.AppDataSource.getRepository(orders_entity_1.Order);
    const collectionRepo = data_source_1.AppDataSource.getRepository(collections_entity_1.CollectionAccount);
    const clientsService = new clients_service_1.ClientsService(clientRepo, orderRepo, collectionRepo);
    const clientsController = new clients_controller_1.ClientController(clientsService);
    router.get('/', middleware_1.authenticate, clientsController.getAll);
    router.get('/:id', middleware_1.authenticate, clientsController.getById);
    router.post('/', middleware_1.authenticate, (0, middleware_1.validate)(clients_validator_1.createClientSchema), clientsController.create);
    router.put('/:id', middleware_1.authenticate, (0, middleware_1.validate)(clients_validator_1.updateClientSchema), clientsController.update);
    router.delete('/:id', middleware_1.authenticate, clientsController.delete);
    router.get('/:id/history', middleware_1.authenticate, clientsController.getHistory);
}
//# sourceMappingURL=clients.routes.js.map