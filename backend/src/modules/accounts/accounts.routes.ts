import { Router } from 'express';
import { AppDataSource } from '../../database/data-source';
import { Account } from './accounts.entity';
import { AccountsService } from './accounts.service';
import { AccountController } from './accounts.controller';
import { authenticate, authorize } from '../../shared/middleware';
import { validate } from '../../shared/middleware';
import { createAccountSchema, updateAccountSchema } from './accounts.validator';

export function registerAccountRoutes(router: Router): void {
  const subrouter = Router();
  const repo = AppDataSource.getRepository(Account);
  const service = new AccountsService(repo);
  const controller = new AccountController(service);

  subrouter.get('/', authenticate, controller.getAll);
  subrouter.get('/:id', authenticate, controller.getById);
  subrouter.post('/', authenticate, authorize('ADMIN'), validate(createAccountSchema), controller.create);
  subrouter.put('/:id', authenticate, authorize('ADMIN'), validate(updateAccountSchema), controller.update);
  subrouter.delete('/:id', authenticate, authorize('ADMIN'), controller.delete);

  router.use('/cuentas', subrouter);
}
