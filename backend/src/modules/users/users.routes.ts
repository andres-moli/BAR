import { Router } from 'express';
import { AppDataSource } from '../../database/data-source';
import { User } from './users.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { authenticate, authorize } from '../../shared/middleware';
import { validate } from '../../shared/middleware';
import { createUserSchema, updateUserSchema } from './users.validator';

export function registerUserRoutes(router: Router): void {
  const subrouter = Router();
  const userRepo = AppDataSource.getRepository(User);
  const usersService = new UsersService(userRepo);
  const usersController = new UsersController(usersService);

  subrouter.get('/', authenticate, authorize('ADMIN'), usersController.getAll);
  subrouter.get('/:id', authenticate, authorize('ADMIN'), usersController.getById);
  subrouter.post('/', authenticate, authorize('ADMIN'), validate(createUserSchema), usersController.create);
  subrouter.put('/:id', authenticate, authorize('ADMIN'), validate(updateUserSchema), usersController.update);
  subrouter.delete('/:id', authenticate, authorize('ADMIN'), usersController.delete);
  subrouter.patch('/:id/toggle', authenticate, usersController.toggleActive);

  router.use('/usuarios', subrouter);
}
