import { Request, Response, NextFunction } from 'express';
import { ProductsService } from './products.service';

const wrap = (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) =>
  (req: Request, res: Response, next: NextFunction) => fn(req, res, next).catch(next);

export class ProductController {
  constructor(private service: ProductsService) {}

  getAll = wrap(async (req, res) => {
    const includeInactive = req.query.includeInactive === 'true';
    const products = await this.service.findAll(includeInactive);
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || products.length || 15;
    const total = products.length;
    res.json({ success: true, data: { data: products, total, page, limit, totalPages: Math.ceil(total / limit) } });
  });

  getById = wrap(async (req, res) => {
    const product = await this.service.findById(req.params.id as string);
    res.json({ success: true, data: product });
  });

  create = wrap(async (req, res) => {
    const product = await this.service.create(req.body);
    res.status(201).json({ success: true, data: product });
  });

  update = wrap(async (req, res) => {
    const product = await this.service.update(req.params.id as string, req.body);
    res.json({ success: true, data: product });
  });

  delete = wrap(async (req, res) => {
    await this.service.delete(req.params.id as string);
    res.json({ success: true, data: null });
  });

  getByCategory = wrap(async (req, res) => {
    const products = await this.service.findByCategory(req.params.categoryId as string);
    res.json({ success: true, data: products });
  });

  toggleActive = wrap(async (req, res) => {
    const product = await this.service.toggleActive(req.params.id as string);
    res.json({ success: true, data: product });
  });
}
