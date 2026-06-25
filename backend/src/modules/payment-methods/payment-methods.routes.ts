import { Router } from 'express';
import { AppDataSource } from '../../database/data-source';
import { PaymentMethod } from './payment-methods.entity';
import { PaymentMethodsService } from './payment-methods.service';
import { PaymentMethodController } from './payment-methods.controller';
import { authenticate, authorize } from '../../shared/middleware';
import { validate } from '../../shared/middleware';
import { createPaymentMethodSchema, updatePaymentMethodSchema } from './payment-methods.validator';

export function registerPaymentMethodRoutes(router: Router): void {
  const subrouter = Router();
  const repo = AppDataSource.getRepository(PaymentMethod);
  const service = new PaymentMethodsService(repo);
  const controller = new PaymentMethodController(service);

  subrouter.get('/', authenticate, controller.getAll);
  subrouter.get('/:id', authenticate, controller.getById);
  subrouter.get('/cuenta/:accountId', authenticate, controller.getByAccount);
  subrouter.post('/', authenticate, authorize('ADMIN'), validate(createPaymentMethodSchema), controller.create);
  subrouter.put('/:id', authenticate, authorize('ADMIN'), validate(updatePaymentMethodSchema), controller.update);
  subrouter.delete('/:id', authenticate, authorize('ADMIN'), controller.delete);

  router.use('/metodos-pago', subrouter);
}
