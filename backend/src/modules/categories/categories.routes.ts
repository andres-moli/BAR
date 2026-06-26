import { Router } from 'express';
import { AppDataSource } from '../../database/data-source';
import { Category } from './categories.entity';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { authenticate } from '../../shared/middleware';
import { validate } from '../../shared/middleware';
import { createCategorySchema, updateCategorySchema } from './categories.validator';

export function registerCategoryRoutes(router: Router): void {
  const subrouter = Router();
  const categoryRepo = AppDataSource.getRepository(Category);
  const categoriesService = new CategoriesService(categoryRepo);
  const categoriesController = new CategoriesController(categoriesService);

  subrouter.get('/', authenticate, categoriesController.getAll);
  subrouter.get('/:id', authenticate, categoriesController.getById);
  subrouter.post('/', authenticate, validate(createCategorySchema), categoriesController.create);
  subrouter.put('/:id', authenticate, validate(updateCategorySchema), categoriesController.update);
  subrouter.delete('/:id', authenticate, categoriesController.delete);

  router.use('/categorias', subrouter);
}
