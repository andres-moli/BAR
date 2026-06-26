import { Router } from 'express';
import { AppDataSource } from '../../database/data-source';
import { TableEntity } from './tables.entity';
import { TablesService } from './tables.service';
import { TablesController } from './tables.controller';
import { authenticate } from '../../shared/middleware';
import { validate } from '../../shared/middleware';
import { createTableSchema, updateTableSchema, tableStatusSchema } from './tables.validator';

export function registerTableRoutes(router: Router): void {
  const subrouter = Router();
  const tableRepo = AppDataSource.getRepository(TableEntity);
  const tablesService = new TablesService(tableRepo);
  const tablesController = new TablesController(tablesService);

  subrouter.get('/', authenticate, tablesController.getAll);
  subrouter.get('/:id', authenticate, tablesController.getById);
  subrouter.post('/', authenticate, validate(createTableSchema), tablesController.create);
  subrouter.put('/:id', authenticate, validate(updateTableSchema), tablesController.update);
  subrouter.delete('/:id', authenticate, tablesController.delete);
  subrouter.patch('/:id/estado', authenticate, validate(tableStatusSchema), tablesController.updateStatus);

  router.use('/mesas', subrouter);
}
