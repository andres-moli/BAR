import { Request, Response, NextFunction } from 'express';
import { AccountsService } from './accounts.service';

const wrap = (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) =>
  (req: Request, res: Response, next: NextFunction) => fn(req, res, next).catch(next);

export class AccountController {
  constructor(private service: AccountsService) {}

  getAll = wrap(async (req, res) => {
    const includeInactive = req.query.includeInactive === 'true';
    const accounts = await this.service.findAll(includeInactive);
    res.json({ success: true, data: accounts });
  });

  getById = wrap(async (req, res) => {
    const account = await this.service.findById(req.params.id as string);
    res.json({ success: true, data: account });
  });

  create = wrap(async (req, res) => {
    const account = await this.service.create(req.body);
    res.status(201).json({ success: true, data: account });
  });

  update = wrap(async (req, res) => {
    const account = await this.service.update(req.params.id as string, req.body);
    res.json({ success: true, data: account });
  });

  delete = wrap(async (req, res) => {
    await this.service.delete(req.params.id as string);
    res.json({ success: true, data: null });
  });
}
