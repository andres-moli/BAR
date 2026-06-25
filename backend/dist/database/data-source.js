"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const index_1 = require("../config/index");
const users_entity_1 = require("../modules/users/users.entity");
const tables_entity_1 = require("../modules/tables/tables.entity");
const categories_entity_1 = require("../modules/categories/categories.entity");
const products_entity_1 = require("../modules/products/products.entity");
const orders_entity_1 = require("../modules/orders/orders.entity");
const order_item_entity_1 = require("../modules/orders/order-item.entity");
const payments_entity_1 = require("../modules/payments/payments.entity");
const invoice_entity_1 = require("../modules/payments/invoice.entity");
const clients_entity_1 = require("../modules/clients/clients.entity");
const collections_entity_1 = require("../modules/collections/collections.entity");
const collection_payment_entity_1 = require("../modules/collections/collection-payment.entity");
const movement_entity_1 = require("../modules/products/movement.entity");
const accounts_entity_1 = require("../modules/accounts/accounts.entity");
const payment_methods_entity_1 = require("../modules/payment-methods/payment-methods.entity");
const cash_register_entity_1 = require("../modules/cash-register/cash-register.entity");
const cash_movement_entity_1 = require("../modules/cash-register/cash-movement.entity");
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    url: index_1.config.databaseUrl,
    synchronize: true,
    logging: index_1.config.nodeEnv === 'development',
    entities: [
        users_entity_1.User, tables_entity_1.TableEntity, categories_entity_1.Category, products_entity_1.Product, orders_entity_1.Order, order_item_entity_1.OrderItem,
        payments_entity_1.Payment, invoice_entity_1.Invoice, clients_entity_1.Client, collections_entity_1.CollectionAccount, collection_payment_entity_1.CollectionPayment,
        movement_entity_1.Movement, accounts_entity_1.Account, payment_methods_entity_1.PaymentMethod, cash_register_entity_1.CashRegister, cash_movement_entity_1.CashMovement,
    ],
    subscribers: [],
    migrations: [],
});
//# sourceMappingURL=data-source.js.map