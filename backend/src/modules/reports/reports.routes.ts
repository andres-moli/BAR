import { Router } from 'express';
import { AppDataSource } from '../../database/data-source';
import { Order } from '../orders/orders.entity';
import { Payment } from '../payments/payments.entity';
import { ReportsService } from './reports.service';
import { ReportController } from './reports.controller';
import { authenticate } from '../../shared/middleware';

export function registerReportRoutes(router: Router): void {
  const subrouter = Router();
  const orderRepo = AppDataSource.getRepository(Order);
  const paymentRepo = AppDataSource.getRepository(Payment);
  const service = new ReportsService(orderRepo, paymentRepo);
  const controller = new ReportController(service);

  subrouter.get('/dashboard', authenticate, controller.dashboardHandler);
  subrouter.get('/sales/day', authenticate, controller.salesByDayHandler);
  subrouter.get('/sales/month', authenticate, controller.salesByMonthHandler);
  subrouter.get('/sales/product', authenticate, controller.salesByProductHandler);
  subrouter.get('/sales/category', authenticate, controller.salesByCategoryHandler);
  subrouter.get('/sales/user', authenticate, controller.salesByUserHandler);
  subrouter.get('/top-products', authenticate, controller.topProductsHandler);
  subrouter.get('/payment-methods', authenticate, controller.paymentMethodsHandler);
  subrouter.get('/collections', authenticate, controller.collectionsHandler);
  subrouter.get('/clients-debt', authenticate, controller.clientsWithDebtHandler);

  router.use('/reportes', subrouter);
}
