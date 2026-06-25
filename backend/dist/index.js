"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const express_2 = require("express");
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const index_1 = require("./config/index");
const data_source_1 = require("./database/data-source");
const middleware_1 = require("./shared/middleware");
const auth_routes_1 = require("./modules/auth/auth.routes");
const users_routes_1 = require("./modules/users/users.routes");
const tables_routes_1 = require("./modules/tables/tables.routes");
const categories_routes_1 = require("./modules/categories/categories.routes");
const products_routes_1 = require("./modules/products/products.routes");
const orders_routes_1 = require("./modules/orders/orders.routes");
const payments_routes_1 = require("./modules/payments/payments.routes");
const clients_routes_1 = require("./modules/clients/clients.routes");
const collections_routes_1 = require("./modules/collections/collections.routes");
const reports_routes_1 = require("./modules/reports/reports.routes");
const print_routes_1 = require("./modules/print/print.routes");
const accounts_routes_1 = require("./modules/accounts/accounts.routes");
const payment_methods_routes_1 = require("./modules/payment-methods/payment-methods.routes");
const cash_register_routes_1 = require("./modules/cash-register/cash-register.routes");
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)(index_1.config.cors));
app.use((0, morgan_1.default)(index_1.config.nodeEnv === 'development' ? 'dev' : 'combined'));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, error: { message: 'Too many requests, please try again later.', code: 'RateLimitError' } },
});
app.use(limiter);
const swaggerSpec = (0, swagger_jsdoc_1.default)({
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'BAR POS API',
            version: '1.0.0',
            description: 'Point of Sale System for Bars and Restaurants',
        },
        servers: [{ url: '/api/v1' }],
        components: {
            securitySchemes: {
                bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
            },
        },
        security: [{ bearerAuth: [] }],
    },
    apis: ['./src/modules/**/*.routes.ts', './src/modules/**/*.routes.js'],
});
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
app.get('/health', (_req, res) => {
    res.json({ success: true, data: { status: 'ok', timestamp: new Date().toISOString() } });
});
const api = (0, express_2.Router)();
const v1 = (0, express_2.Router)();
(0, auth_routes_1.registerAuthRoutes)(v1);
(0, users_routes_1.registerUserRoutes)(v1);
(0, tables_routes_1.registerTableRoutes)(v1);
(0, categories_routes_1.registerCategoryRoutes)(v1);
(0, products_routes_1.registerProductRoutes)(v1);
(0, orders_routes_1.registerOrderRoutes)(v1);
(0, payments_routes_1.registerPaymentRoutes)(v1);
(0, clients_routes_1.registerClientRoutes)(v1);
(0, collections_routes_1.registerCollectionRoutes)(v1);
(0, reports_routes_1.registerReportRoutes)(v1);
(0, print_routes_1.registerPrintRoutes)(v1);
(0, accounts_routes_1.registerAccountRoutes)(v1);
(0, payment_methods_routes_1.registerPaymentMethodRoutes)(v1);
(0, cash_register_routes_1.registerCashRegisterRoutes)(v1);
api.use('/v1', v1);
app.use('/api', api);
app.use(middleware_1.errorHandler);
async function main() {
    try {
        await data_source_1.AppDataSource.initialize();
        console.log('Database connected successfully');
        app.listen(index_1.config.port, () => {
            console.log(`Server running on port ${index_1.config.port} in ${index_1.config.nodeEnv} mode`);
            console.log(`API docs available at http://localhost:${index_1.config.port}/api-docs`);
        });
    }
    catch (error) {
        console.error('Failed to start server', error);
        process.exit(1);
    }
}
process.on('unhandledRejection', (reason) => {
    console.error('Unhandled Rejection', reason instanceof Error ? reason.message : reason);
    process.exit(1);
});
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception', error.message);
    process.exit(1);
});
process.on('SIGTERM', async () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    await data_source_1.AppDataSource.destroy();
    process.exit(0);
});
main();
exports.default = app;
//# sourceMappingURL=index.js.map