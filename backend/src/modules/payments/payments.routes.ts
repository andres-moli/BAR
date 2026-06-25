import { Router } from 'express';
import { AppDataSource } from '../../database/data-source';
import { Payment } from './payments.entity';
import { Order } from '../orders/orders.entity';
import { Invoice } from './invoice.entity';
import { PaymentsService } from './payments.service';
import { PaymentController } from './payments.controller';
import { authenticate, validate } from '../../shared/middleware';
import { processPaymentSchema } from './payments.validator';

export function registerPaymentRoutes(router: Router): void {
  const subrouter = Router();
  const paymentRepo = AppDataSource.getRepository(Payment);
  const invoiceRepo = AppDataSource.getRepository(Invoice);
  const orderRepo = AppDataSource.getRepository(Order);
  const paymentsService = new PaymentsService(paymentRepo, invoiceRepo, orderRepo);
  const paymentsController = new PaymentController(paymentsService);

  subrouter.get('/pendientes', authenticate, paymentsController.getPending);
  subrouter.get('/:orderId', authenticate, paymentsController.getOrderBillingDetail);
  subrouter.post('/pagar', authenticate, validate(processPaymentSchema), paymentsController.processPayment);
  subrouter.get('/:orderId/pagos', authenticate, paymentsController.getByOrder);
  subrouter.post('/:orderId/factura', authenticate, paymentsController.generateInvoice);
  subrouter.post('/:orderId/imprimir', authenticate, (_req, res) => {
    res.json({ success: true, data: { message: 'Print job queued' } });
  });

  router.use('/facturacion', subrouter);
}
