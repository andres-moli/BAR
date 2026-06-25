import { Router } from 'express';
import { AppDataSource } from '../../database/data-source';
import { Order } from '../orders/orders.entity';
import { Invoice } from '../payments/invoice.entity';
import { CollectionAccount } from '../collections/collections.entity';
import { PrintService } from './print.service';
import { PrintController } from './print.controller';
import { authenticate } from '../../shared/middleware';
import { validate } from '../../shared/middleware';
import { z } from 'zod';

const printOrderSchema = z.object({ orderId: z.string().uuid('Invalid order ID') });
const printInvoiceSchema = z.object({
  orderId: z.string().uuid('Invalid order ID'),
  nit: z.string().max(20).optional(),
  name: z.string().max(200).optional(),
  email: z.string().email().optional(),
});
const printCollectionSchema = z.object({ collectionId: z.string().uuid('Invalid collection ID') });

export function registerPrintRoutes(router: Router): void {
  const subrouter = Router();
  const orderRepo = AppDataSource.getRepository(Order);
  const invoiceRepo = AppDataSource.getRepository(Invoice);
  const collectionRepo = AppDataSource.getRepository(CollectionAccount);
  const service = new PrintService(orderRepo, invoiceRepo, collectionRepo);
  const controller = new PrintController(service);

  subrouter.post('/order', authenticate, validate(printOrderSchema), controller.printOrderHandler);
  subrouter.post('/pre-bill', authenticate, validate(printOrderSchema), controller.printPreBillHandler);
  subrouter.post('/invoice', authenticate, validate(printInvoiceSchema), controller.printInvoiceHandler);
  subrouter.post('/collection', authenticate, validate(printCollectionSchema), controller.printCollectionHandler);

  router.use('/imprimir', subrouter);
}
