"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerCollectionRoutes = registerCollectionRoutes;
const data_source_1 = require("../../database/data-source");
const collections_entity_1 = require("./collections.entity");
const collection_payment_entity_1 = require("./collection-payment.entity");
const collections_service_1 = require("./collections.service");
const collections_controller_1 = require("./collections.controller");
const middleware_1 = require("../../shared/middleware");
const middleware_2 = require("../../shared/middleware");
const collections_validator_1 = require("./collections.validator");
function registerCollectionRoutes(router) {
    const repo = data_source_1.AppDataSource.getRepository(collections_entity_1.CollectionAccount);
    const paymentRepo = data_source_1.AppDataSource.getRepository(collection_payment_entity_1.CollectionPayment);
    const service = new collections_service_1.CollectionsService(repo, paymentRepo);
    const controller = new collections_controller_1.CollectionController(service);
    router.get('/', middleware_1.authenticate, controller.getAll);
    router.get('/:id', middleware_1.authenticate, controller.getById);
    router.post('/', middleware_1.authenticate, (0, middleware_2.validate)(collections_validator_1.createCollectionSchema), controller.create);
    router.post('/:id/payments', middleware_1.authenticate, (0, middleware_2.validate)(collections_validator_1.registerPaymentSchema), controller.registerPayment);
}
//# sourceMappingURL=collections.routes.js.map