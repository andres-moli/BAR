import { Request, Response, NextFunction } from 'express';
import { ClientsService } from './clients.service';

const wrap = (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) =>
  (req: Request, res: Response, next: NextFunction) => fn(req, res, next).catch(next);

export class ClientController {
  constructor(private service: ClientsService) {}

  getAll = wrap(async (req, res) => {
    const clients = await this.service.findAll();
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || clients.length || 15;
    const total = clients.length;
    res.json({ success: true, data: { data: clients, total, page, limit, totalPages: Math.ceil(total / limit) } });
  });

  getById = wrap(async (req, res) => {
    const client = await this.service.findById(req.params.id as string);
    res.json({ success: true, data: client });
  });

  create = wrap(async (req, res) => {
    const client = await this.service.create(req.body);
    res.status(201).json({ success: true, data: client });
  });

  update = wrap(async (req, res) => {
    const client = await this.service.update(req.params.id as string, req.body);
    res.json({ success: true, data: client });
  });

  delete = wrap(async (req, res) => {
    await this.service.delete(req.params.id as string);
    res.json({ success: true, data: null });
  });

  getHistory = wrap(async (req, res) => {
    const history = await this.service.getHistory(req.params.id as string);
    res.json({ success: true, data: history });
  });

  getOrders = wrap(async (req, res) => {
    const orders = await this.service.getOrders(req.params.id as string);
    res.json({ success: true, data: orders });
  });

  getCollectionAccounts = wrap(async (req, res) => {
    const accounts = await this.service.getCollectionAccounts(req.params.id as string);
    res.json({ success: true, data: accounts });
  });
}
