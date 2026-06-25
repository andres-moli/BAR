import { Router } from 'express';
import { AppDataSource } from '../../database/data-source';
import { Client } from './clients.entity';
import { Order } from '../orders/orders.entity';
import { CollectionAccount } from '../collections/collections.entity';
import { ClientsService } from './clients.service';
import { ClientController } from './clients.controller';
import { authenticate, validate } from '../../shared/middleware';
import { createClientSchema, updateClientSchema } from './clients.validator';

export function registerClientRoutes(router: Router): void {
  const subrouter = Router();
  const clientRepo = AppDataSource.getRepository(Client);
  const orderRepo = AppDataSource.getRepository(Order);
  const collectionRepo = AppDataSource.getRepository(CollectionAccount);
  const clientsService = new ClientsService(clientRepo, orderRepo, collectionRepo);
  const clientsController = new ClientController(clientsService);

  subrouter.get('/', authenticate, clientsController.getAll);
  subrouter.get('/:id', authenticate, clientsController.getById);
  subrouter.post('/', authenticate, validate(createClientSchema), clientsController.create);
  subrouter.put('/:id', authenticate, validate(updateClientSchema), clientsController.update);
  subrouter.delete('/:id', authenticate, clientsController.delete);
  subrouter.get('/:id/history', authenticate, clientsController.getHistory);
  subrouter.get('/:id/pedidos', authenticate, clientsController.getOrders);
  subrouter.get('/:id/cuentas-cobro', authenticate, clientsController.getCollectionAccounts);

  router.use('/clientes', subrouter);
}
