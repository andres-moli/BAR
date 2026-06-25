import { Router } from 'express';
import { AppDataSource } from '../../database/data-source';
import { CollectionAccount } from './collections.entity';
import { CollectionPayment } from './collection-payment.entity';
import { CollectionsService } from './collections.service';
import { CollectionController } from './collections.controller';
import { authenticate } from '../../shared/middleware';
import { validate } from '../../shared/middleware';
import { createCollectionSchema, registerPaymentSchema } from './collections.validator';

export function registerCollectionRoutes(router: Router): void {
  const subrouter = Router();
  const repo = AppDataSource.getRepository(CollectionAccount);
  const paymentRepo = AppDataSource.getRepository(CollectionPayment);
  const service = new CollectionsService(repo, paymentRepo);
  const controller = new CollectionController(service);

  subrouter.get('/', authenticate, controller.getAll);
  subrouter.get('/:id', authenticate, controller.getById);
  subrouter.post('/', authenticate, validate(createCollectionSchema), controller.create);
  subrouter.post('/:id/payments', authenticate, validate(registerPaymentSchema), controller.registerPayment);
  subrouter.post('/pagos', authenticate, validate(registerPaymentSchema), async (req, res, next) => {
    try {
      const { collectionId, ...paymentData } = req.body;
      if (!collectionId) {
        res.status(400).json({ success: false, message: 'collectionId is required' });
        return;
      }
      const payment = await service.registerPayment(collectionId, paymentData);
      res.status(201).json({ success: true, data: payment });
    } catch (err) {
      next(err);
    }
  });

  router.use('/cuentas-cobro', subrouter);
}
