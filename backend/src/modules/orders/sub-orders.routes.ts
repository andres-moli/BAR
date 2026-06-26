import { Router } from 'express';
import { AppDataSource } from '../../database/data-source';
import { SubOrder } from './sub-order.entity';
import { OrderItem } from './order-item.entity';
import { SubOrdersService } from './sub-orders.service';
import { SubOrdersController } from './sub-orders.controller';
import { authenticate, authorize } from '../../shared/middleware';

export function registerSubOrderRoutes(router: Router): void {
  const subrouter = Router();
  const subOrderRepo = AppDataSource.getRepository(SubOrder);
  const itemRepo = AppDataSource.getRepository(OrderItem);
  const service = new SubOrdersService(subOrderRepo, itemRepo);
  const controller = new SubOrdersController(service);

  subrouter.post('/pedidos/:orderId/sub-ordenes', authenticate, controller.create);
  subrouter.patch('/sub-ordenes/:id/confirmar', authenticate, controller.confirm);
  subrouter.patch('/sub-ordenes/:id/entregar', authenticate, authorize('ADMIN', 'CAJERO'), controller.deliver);
  subrouter.get('/sub-ordenes/pendientes', authenticate, authorize('ADMIN', 'CAJERO'), controller.getPending);
  subrouter.get('/pedidos/:orderId/sub-ordenes', authenticate, controller.getByOrder);
  subrouter.get('/sub-ordenes/:id/items', authenticate, controller.getItems);

  router.use('/', subrouter);
}
