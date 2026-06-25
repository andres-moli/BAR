"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerPrintRoutes = registerPrintRoutes;
const data_source_1 = require("../../database/data-source");
const orders_entity_1 = require("../orders/orders.entity");
const invoice_entity_1 = require("../payments/invoice.entity");
const collections_entity_1 = require("../collections/collections.entity");
const print_service_1 = require("./print.service");
const print_controller_1 = require("./print.controller");
const middleware_1 = require("../../shared/middleware");
const middleware_2 = require("../../shared/middleware");
const zod_1 = require("zod");
const printOrderSchema = zod_1.z.object({ orderId: zod_1.z.string().uuid('Invalid order ID') });
const printInvoiceSchema = zod_1.z.object({
    orderId: zod_1.z.string().uuid('Invalid order ID'),
    nit: zod_1.z.string().max(20).optional(),
    name: zod_1.z.string().max(200).optional(),
    email: zod_1.z.string().email().optional(),
});
const printCollectionSchema = zod_1.z.object({ collectionId: zod_1.z.string().uuid('Invalid collection ID') });
function registerPrintRoutes(router) {
    const orderRepo = data_source_1.AppDataSource.getRepository(orders_entity_1.Order);
    const invoiceRepo = data_source_1.AppDataSource.getRepository(invoice_entity_1.Invoice);
    const collectionRepo = data_source_1.AppDataSource.getRepository(collections_entity_1.CollectionAccount);
    const service = new print_service_1.PrintService(orderRepo, invoiceRepo, collectionRepo);
    const controller = new print_controller_1.PrintController(service);
    router.post('/order', middleware_1.authenticate, (0, middleware_2.validate)(printOrderSchema), controller.printOrderHandler);
    router.post('/pre-bill', middleware_1.authenticate, (0, middleware_2.validate)(printOrderSchema), controller.printPreBillHandler);
    router.post('/invoice', middleware_1.authenticate, (0, middleware_2.validate)(printInvoiceSchema), controller.printInvoiceHandler);
    router.post('/collection', middleware_1.authenticate, (0, middleware_2.validate)(printCollectionSchema), controller.printCollectionHandler);
}
//# sourceMappingURL=print.routes.js.map