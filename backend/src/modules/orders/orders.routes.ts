import { Router } from 'express';
import { AppDataSource } from '../../database/data-source';
import { Order } from './orders.entity';
import { OrderItem } from './order-item.entity';
import { Product } from '../products/products.entity';
import { Movement } from '../products/movement.entity';
import { TableEntity } from '../tables/tables.entity';
import { OrdersService } from './orders.service';
import { OrderController } from './orders.controller';
import { authenticate, authorize, validate } from '../../shared/middleware';
import { createOrderSchema, addItemSchema, updateItemSchema, changeTableSchema, splitOrderSchema } from './orders.validator';

export function registerOrderRoutes(router: Router): void {
  const subrouter = Router();
  const orderRepo = AppDataSource.getRepository(Order);
  const orderItemRepo = AppDataSource.getRepository(OrderItem);
  const productRepo = AppDataSource.getRepository(Product);
  const movementRepo = AppDataSource.getRepository(Movement);
  const tableRepo = AppDataSource.getRepository(TableEntity);
  const ordersService = new OrdersService(orderRepo, orderItemRepo, productRepo, tableRepo, movementRepo);
  const ordersController = new OrderController(ordersService);

  subrouter.get('/', authenticate, ordersController.getAll);
  subrouter.get('/:id', authenticate, ordersController.getById);
  subrouter.post('/', authenticate, validate(createOrderSchema), ordersController.create);
  subrouter.post('/:id/items', authenticate, validate(addItemSchema), ordersController.addItem);
  subrouter.put('/:id/items/:itemId', authenticate, validate(updateItemSchema), ordersController.updateItem);
  subrouter.delete('/:id/items/:itemId', authenticate, ordersController.removeItem);
  subrouter.get('/pending-approval', authenticate, authorize('ADMIN'), ordersController.getPendingApproval);
  subrouter.get('/:id/history', authenticate, ordersController.getHistory);
  subrouter.get('/:id/versions', authenticate, ordersController.getVersions);
  subrouter.get('/mesa/:mesaId', authenticate, ordersController.getByTable);
  subrouter.patch('/:id/estado', authenticate, ordersController.updateStatus);
  subrouter.patch('/:id/cambiar-mesa', authenticate, validate(changeTableSchema), ordersController.changeTable);
  subrouter.post('/:id/dividir', authenticate, authorize('ADMIN'), validate(splitOrderSchema), ordersController.splitOrder);
  subrouter.post('/:id/cancelar', authenticate, ordersController.cancel);
  subrouter.post('/:id/imprimir', authenticate, (_req, res) => {
    res.json({ success: true, data: { message: 'Print job queued' } });
  });

  router.use('/pedidos', subrouter);
}
