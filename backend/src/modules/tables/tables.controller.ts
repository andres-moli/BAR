import { Request, Response, NextFunction } from 'express';
import { TablesService } from './tables.service';

type Handler = (req: Request, res: Response, next: NextFunction) => Promise<void>;

const wrap = (fn: Handler) => (req: Request, res: Response, next: NextFunction): Promise<void> => {
  return fn(req, res, next).catch(next);
};

export class TablesController {
  constructor(private tablesService: TablesService) {}

  getAll: Handler = wrap(async (_req, res) => {
    const tables = await this.tablesService.findAll();
    res.json({ success: true, data: tables });
  });

  getById: Handler = wrap(async (req, res) => {
    const table = await this.tablesService.findById(req.params.id as string);
    res.json({ success: true, data: table });
  });

  create: Handler = wrap(async (req, res) => {
    const table = await this.tablesService.create(req.body);
    res.status(201).json({ success: true, data: table });
  });

  update: Handler = wrap(async (req, res) => {
    const table = await this.tablesService.update(req.params.id as string, req.body);
    res.json({ success: true, data: table });
  });

  delete: Handler = wrap(async (req, res) => {
    await this.tablesService.delete(req.params.id as string);
    res.json({ success: true, data: null });
  });

  updateStatus: Handler = wrap(async (req, res) => {
    const table = await this.tablesService.updateStatus(req.params.id as string, req.body.status);
    res.json({ success: true, data: table });
  });
}
