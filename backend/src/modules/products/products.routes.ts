import { Router } from 'express';
import { AppDataSource } from '../../database/data-source';
import { Product } from './products.entity';
import { ProductsService } from './products.service';
import { ProductController } from './products.controller';
import { authenticate, validate } from '../../shared/middleware';
import { createProductSchema, updateProductSchema } from './products.validator';

export function registerProductRoutes(router: Router): void {
  const subrouter = Router();
  const productRepo = AppDataSource.getRepository(Product);
  const productsService = new ProductsService(productRepo);
  const productsController = new ProductController(productsService);

  subrouter.get('/', authenticate, productsController.getAll);
  subrouter.get('/:id', authenticate, productsController.getById);
  subrouter.post('/', authenticate, validate(createProductSchema), productsController.create);
  subrouter.put('/:id', authenticate, validate(updateProductSchema), productsController.update);
  subrouter.delete('/:id', authenticate, productsController.delete);
  subrouter.get('/category/:categoryId', authenticate, productsController.getByCategory);
  subrouter.patch('/:id/toggle', authenticate, productsController.toggleActive);

  router.use('/productos', subrouter);
}
