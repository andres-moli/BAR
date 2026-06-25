import { Request, Response, NextFunction } from 'express';
import { CollectionsService } from './collections.service';

const wrap = (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) =>
  (req: Request, res: Response, next: NextFunction) => fn(req, res, next).catch(next);

export class CollectionController {
  constructor(private service: CollectionsService) {}

  getAll = wrap(async (req, res) => {
    const collections = await this.service.findAll();
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || collections.length || 15;
    const total = collections.length;
    res.json({ success: true, data: { data: collections, total, page, limit, totalPages: Math.ceil(total / limit) } });
  });

  getById = wrap(async (req, res) => {
    const collection = await this.service.findById(req.params.id as string);
    res.json({ success: true, data: collection });
  });

  create = wrap(async (req, res) => {
    const collection = await this.service.create(req.body);
    res.status(201).json({ success: true, data: collection });
  });

  registerPayment = wrap(async (req, res) => {
    const payment = await this.service.registerPayment(req.params.id as string, req.body);
    res.status(201).json({ success: true, data: payment });
  });
}
