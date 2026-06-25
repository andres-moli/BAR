import { Router } from 'express';
import { AppDataSource } from '../../database/data-source';
import { CashRegister } from './cash-register.entity';
import { CashMovement } from './cash-movement.entity';
import { CashRegisterService } from './cash-register.service';
import { CashRegisterController } from './cash-register.controller';
import { authenticate, authorize } from '../../shared/middleware';
import { validate } from '../../shared/middleware';
import { openCashRegisterSchema, closeCashRegisterSchema } from './cash-register.validator';

export function registerCashRegisterRoutes(router: Router): void {
  const subrouter = Router();
  const repo = AppDataSource.getRepository(CashRegister);
  const movementRepo = AppDataSource.getRepository(CashMovement);
  const service = new CashRegisterService(repo, movementRepo);
  const controller = new CashRegisterController(service);

  subrouter.post('/abrir', authenticate, authorize('ADMIN'), validate(openCashRegisterSchema), controller.open);
  subrouter.post('/cerrar', authenticate, authorize('ADMIN'), validate(closeCashRegisterSchema), controller.close);
  subrouter.get('/actual', authenticate, controller.getCurrent);
  subrouter.get('/:id/movimientos', authenticate, controller.getMovements);
  subrouter.get('/:id/resumen', authenticate, controller.getSummary);
  subrouter.get('/historial', authenticate, controller.getHistory);

  router.use('/caja', subrouter);
}
