import { Router } from 'express';
import { AppDataSource } from '../../database/data-source';
import { CashRegister } from './cash-register.entity';
import { CashMovement } from './cash-movement.entity';
import { CashRegisterService } from './cash-register.service';
import { CashRegisterController } from './cash-register.controller';
import { authenticate, authorize } from '../../shared/middleware';
import { validate } from '../../shared/middleware';
import { openCashRegisterSchema, closeCashRegisterSchema } from './cash-register.validator';
import { Payment } from '../payments/payments.entity';
import { Order } from '../orders/orders.entity';

export function registerCashRegisterRoutes(router: Router): void {
  const subrouter = Router();
  const repo = AppDataSource.getRepository(CashRegister);
  const movementRepo = AppDataSource.getRepository(CashMovement);
  const paymentRepo = AppDataSource.getRepository(Payment);
  const orderRepo = AppDataSource.getRepository(Order);
  const service = new CashRegisterService(repo, movementRepo, paymentRepo, orderRepo);
  const controller = new CashRegisterController(service);

  subrouter.post('/abrir', authenticate, validate(openCashRegisterSchema), controller.open);
  subrouter.post('/cerrar', authenticate, validate(closeCashRegisterSchema), controller.close);
  subrouter.get('/actual', authenticate, controller.getCurrent);
  subrouter.get('/:id/movimientos', authenticate, controller.getMovements);
  subrouter.get('/:id/resumen', authenticate, controller.getSummary);
  subrouter.get('/:id/reporte-meseros', authenticate, controller.getWaiterReport);
  subrouter.get('/historial', authenticate, controller.getHistory);

  router.use('/caja', subrouter);
}
