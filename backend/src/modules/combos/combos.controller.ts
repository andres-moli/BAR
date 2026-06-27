import { Request, Response, NextFunction } from 'express';
import { ComboService } from './combos.service';

const wrap = (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) =>
  (req: Request, res: Response, next: NextFunction) => fn(req, res, next).catch(next);

export class ComboController {
  constructor(private comboService: ComboService) {}

  list = wrap(async (_req, res) => {
    const combos = await this.comboService.getAll();
    res.json({ success: true, data: combos });
  });

  listActive = wrap(async (_req, res) => {
    const combos = await this.comboService.getActive();
    res.json({ success: true, data: combos });
  });

  getById = wrap(async (req, res) => {
    const combo = await this.comboService.getById(req.params.id as string);
    res.json({ success: true, data: combo });
  });

  getByCategory = wrap(async (req, res) => {
    const combos = await this.comboService.getByCategory(req.params.categoryId as string);
    res.json({ success: true, data: combos });
  });

  create = wrap(async (req, res) => {
    const combo = await this.comboService.create(req.body);
    res.status(201).json({ success: true, data: combo });
  });

  update = wrap(async (req, res) => {
    const combo = await this.comboService.update(req.params.id as string, req.body);
    res.json({ success: true, data: combo });
  });

  remove = wrap(async (req, res) => {
    await this.comboService.remove(req.params.id as string);
    res.json({ success: true, data: { message: 'Combo eliminado' } });
  });
}
