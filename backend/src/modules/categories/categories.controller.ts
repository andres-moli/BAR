import { Request, Response, NextFunction } from 'express';
import { CategoriesService } from './categories.service';

type Handler = (req: Request, res: Response, next: NextFunction) => Promise<void>;

const wrap = (fn: Handler) => (req: Request, res: Response, next: NextFunction): Promise<void> => {
  return fn(req, res, next).catch(next);
};

export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  getAll: Handler = wrap(async (_req, res) => {
    const categories = await this.categoriesService.findAll();
    res.json({ success: true, data: categories });
  });

  getById: Handler = wrap(async (req, res) => {
    const category = await this.categoriesService.findById(req.params.id as string);
    res.json({ success: true, data: category });
  });

  create: Handler = wrap(async (req, res) => {
    const category = await this.categoriesService.create(req.body);
    res.status(201).json({ success: true, data: category });
  });

  update: Handler = wrap(async (req, res) => {
    const category = await this.categoriesService.update(req.params.id as string, req.body);
    res.json({ success: true, data: category });
  });

  delete: Handler = wrap(async (req, res) => {
    await this.categoriesService.delete(req.params.id as string);
    res.json({ success: true, data: null });
  });
}
