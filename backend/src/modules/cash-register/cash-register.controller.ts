import { Request, Response, NextFunction } from 'express';
import { CashRegisterService } from './cash-register.service';

const wrap = (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) =>
  (req: Request, res: Response, next: NextFunction) => fn(req, res, next).catch(next);

export class CashRegisterController {
  constructor(private service: CashRegisterService) {}

  open = wrap(async (req, res) => {
    const register = await this.service.open(req.body, req.user!.id);
    res.status(201).json({ success: true, data: register });
  });

  close = wrap(async (req, res) => {
    const id = (req.params.id as string) || req.body.cashRegisterId;
    const register = await this.service.close(id, req.user!.id, req.body.notes);
    res.json({ success: true, data: register });
  });

  getCurrent = wrap(async (_req, res) => {
    const register = await this.service.getCurrent();
    res.json({ success: true, data: register });
  });

  getMovements = wrap(async (req, res) => {
    const id = (req.params.id as string) || (req.query.cashRegisterId as string);
    const movements = await this.service.getMovements(id);
    res.json({ success: true, data: movements });
  });

  getHistory = wrap(async (req, res) => {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 20;
    const result = await this.service.getHistory(page, limit);
    res.json({ success: true, ...result });
  });

  getSummary = wrap(async (req, res) => {
    const id = (req.params.id as string) || (req.query.cashRegisterId as string);
    const summary = await this.service.getSummary(id);
    res.json({ success: true, data: summary });
  });
}
