import { Request, Response, NextFunction } from 'express';
import { PaymentMethodsService } from './payment-methods.service';

const wrap = (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) =>
  (req: Request, res: Response, next: NextFunction) => fn(req, res, next).catch(next);

export class PaymentMethodController {
  constructor(private service: PaymentMethodsService) {}

  getAll = wrap(async (req, res) => {
    const includeInactive = req.query.includeInactive === 'true';
    const methods = await this.service.findAll(includeInactive);
    res.json({ success: true, data: methods });
  });

  getById = wrap(async (req, res) => {
    const method = await this.service.findById(req.params.id as string);
    res.json({ success: true, data: method });
  });

  getByAccount = wrap(async (req, res) => {
    const methods = await this.service.getByAccount(req.params.accountId as string);
    res.json({ success: true, data: methods });
  });

  create = wrap(async (req, res) => {
    const method = await this.service.create(req.body);
    res.status(201).json({ success: true, data: method });
  });

  update = wrap(async (req, res) => {
    const method = await this.service.update(req.params.id as string, req.body);
    res.json({ success: true, data: method });
  });

  delete = wrap(async (req, res) => {
    await this.service.delete(req.params.id as string);
    res.json({ success: true, data: null });
  });
}
