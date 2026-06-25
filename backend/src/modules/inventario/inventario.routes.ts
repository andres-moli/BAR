import { Router } from 'express';
import { AppDataSource } from '../../database/data-source';
import { Product } from '../products/products.entity';
import { Movement } from '../products/movement.entity';
import { InventarioService } from './inventario.service';
import { InventarioController } from './inventario.controller';
import { authenticate, authorize, validate } from '../../shared/middleware';
import { createMovementSchema, adjustStockSchema } from './inventario.validator';

export function registerInventarioRoutes(router: Router): void {
  const subrouter = Router();
  const productRepo = AppDataSource.getRepository(Product);
  const movementRepo = AppDataSource.getRepository(Movement);
  const inventarioService = new InventarioService(productRepo, movementRepo);
  const inventarioController = new InventarioController(inventarioService);

  subrouter.get('/', authenticate, inventarioController.getInventory);
  subrouter.get('/bajo-stock', authenticate, inventarioController.getLowStock);
  subrouter.get('/:productId', authenticate, inventarioController.getProductStock);
  subrouter.get('/:productId/movimientos', authenticate, inventarioController.getMovements);
  subrouter.post('/movimientos', authenticate, authorize('ADMIN'), validate(createMovementSchema), inventarioController.createMovement);
  subrouter.patch('/:productId/ajustar', authenticate, authorize('ADMIN'), validate(adjustStockSchema), inventarioController.adjustStock);

  router.use('/inventario', subrouter);
}
