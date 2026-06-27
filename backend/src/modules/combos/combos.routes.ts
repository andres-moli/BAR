import { Router } from 'express';
import { AppDataSource } from '../../database/data-source';
import { Combo } from './combo.entity';
import { ComboProduct } from './combo-product.entity';
import { ComboService } from './combos.service';
import { ComboController } from './combos.controller';
import { authenticate, authorize } from '../../shared/middleware';

export function registerComboRoutes(router: Router): void {
  const subrouter = Router();
  const comboRepo = AppDataSource.getRepository(Combo);
  const productRepo = AppDataSource.getRepository(ComboProduct);
  const comboService = new ComboService(comboRepo, productRepo);
  const controller = new ComboController(comboService);

  subrouter.get('/activos', authenticate, controller.listActive);
  subrouter.get('/categoria/:categoryId', authenticate, controller.getByCategory);
  subrouter.get('/:id', authenticate, controller.getById);
  subrouter.get('/', authenticate, controller.list);
  subrouter.post('/', authenticate, controller.create);
  subrouter.put('/:id', authenticate, controller.update);
  subrouter.delete('/:id', authenticate, controller.remove);

  router.use('/combos', subrouter);
}
