import 'reflect-metadata';
import express from 'express';
import { Router } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { config } from './config/index';
import { AppDataSource } from './database/data-source';
import { errorHandler } from './shared/middleware';
import { translateBody } from './shared/body-mapper';

import { registerAuthRoutes } from './modules/auth/auth.routes';
import { registerUserRoutes } from './modules/users/users.routes';
import { registerTableRoutes } from './modules/tables/tables.routes';
import { registerCategoryRoutes } from './modules/categories/categories.routes';
import { registerProductRoutes } from './modules/products/products.routes';
import { registerOrderRoutes } from './modules/orders/orders.routes';
import { registerSubOrderRoutes } from './modules/orders/sub-orders.routes';
import { registerPaymentRoutes } from './modules/payments/payments.routes';
import { registerClientRoutes } from './modules/clients/clients.routes';
import { registerCollectionRoutes } from './modules/collections/collections.routes';
import { registerReportRoutes } from './modules/reports/reports.routes';
import { registerPrintRoutes } from './modules/print/print.routes';
import { registerAccountRoutes } from './modules/accounts/accounts.routes';
import { registerPaymentMethodRoutes } from './modules/payment-methods/payment-methods.routes';
import { registerCashRegisterRoutes } from './modules/cash-register/cash-register.routes';
import { registerInventarioRoutes } from './modules/inventario/inventario.routes';
import { registerComboRoutes } from './modules/combos/combos.routes';

const app = express();

app.use(helmet());
app.use(cors({
  origin: '*'
}));
app.use(morgan(config.nodeEnv === 'development' ? 'dev' : 'combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(translateBody);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: { message: 'Too many requests, please try again later.', code: 'RateLimitError' } },
});
// app.use(limiter);

const swaggerSpec = swaggerJsdoc({
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
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/health', (_req, res) => {
  res.json({ success: true, data: { status: 'ok', timestamp: new Date().toISOString() } });
});

const api = Router();
const v1 = Router();

registerAuthRoutes(v1);
registerUserRoutes(v1);
registerTableRoutes(v1);
registerCategoryRoutes(v1);
registerProductRoutes(v1);
registerOrderRoutes(v1);
registerSubOrderRoutes(v1);
registerPaymentRoutes(v1);
registerClientRoutes(v1);
registerCollectionRoutes(v1);
registerReportRoutes(v1);
registerPrintRoutes(v1);
registerAccountRoutes(v1);
registerPaymentMethodRoutes(v1);
registerCashRegisterRoutes(v1);
registerInventarioRoutes(v1);
registerComboRoutes(v1);

api.use('/v1', v1);
app.use('/api', api);

app.use(errorHandler);

async function main() {
  try {
    await AppDataSource.initialize();
    console.log('Database connected successfully');
    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port} in ${config.nodeEnv} mode`);
      console.log(`API docs available at http://localhost:${config.port}/api-docs`);
    });
  } catch (error) {
    console.error('Failed to start server', error);
    process.exit(1);
  }
}

process.on('unhandledRejection', (reason: unknown) => {
  console.error('Unhandled Rejection', reason instanceof Error ? reason.message : reason);
  process.exit(1);
});

process.on('uncaughtException', (error: Error) => {
  console.error('Uncaught Exception', error.message);
  process.exit(1);
});

process.on('SIGTERM', async () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  await AppDataSource.destroy();
  process.exit(0);
});

main();

export default app;
