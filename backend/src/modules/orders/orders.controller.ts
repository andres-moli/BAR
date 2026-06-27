import { Request, Response, NextFunction } from 'express';
import { OrdersService } from './orders.service';
import { ForbiddenError } from '../../shared/errors';

const wrap = (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) =>
  (req: Request, res: Response, next: NextFunction) => fn(req, res, next).catch(next);

export class OrderController {
  constructor(private service: OrdersService) {}

  getAll = wrap(async (req, res) => {
    const filters: any = {};
    if (req.query.status) filters.status = req.query.status;
    if (req.query.tableId) filters.tableId = req.query.tableId;
    if (req.query.userId) filters.userId = req.query.userId;
    if (req.query.clientId) filters.clientId = req.query.clientId;
    if (req.query.startDate) filters.startDate = new Date(req.query.startDate as string);
    if (req.query.endDate) filters.endDate = new Date(req.query.endDate as string);
    const orders = await this.service.findAll(filters);
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || orders.length || 15;
    const total = orders.length;
    res.json({ success: true, data: { data: orders, total, page, limit, totalPages: Math.ceil(total / limit) } });
  });

  getById = wrap(async (req, res) => {
    const order = await this.service.findById(req.params.id as string);
    res.json({ success: true, data: order });
  });

  create = wrap(async (req, res) => {
    const order = await this.service.create({ ...req.body, userId: req.user!.id });
    res.status(201).json({ success: true, data: order });
  });

  addItem = wrap(async (req, res) => {
    const result = await this.service.addItem(req.params.id as string, { ...req.body, userId: req.user!.id });
    const order = await this.service.findById(result.newOrderId);
    res.status(201).json({ success: true, data: order });
  });

  addCombo = wrap(async (req, res) => {
    const result = await this.service.addCombo(req.params.id as string, { ...req.body, userId: req.user!.id });
    const order = await this.service.findById(result.newOrderId);
    res.status(201).json({ success: true, data: order });
  });

  updateItem = wrap(async (req, res) => {
    const result = await this.service.updateItem(req.params.itemId as string, req.body);
    const order = await this.service.findById(result.newOrderId);
    res.json({ success: true, data: order });
  });

  removeItem = wrap(async (req, res) => {
    const result = await this.service.removeItem(req.params.itemId as string);
    const order = await this.service.findById(result.newOrderId);
    res.json({ success: true, data: order });
  });

  changeTable = wrap(async (req, res) => {
    const order = await this.service.changeTable(req.params.id as string, req.body.tableId);
    res.json({ success: true, data: order });
  });

  splitOrder = wrap(async (req, res) => {
    const newOrder = await this.service.splitOrder(req.params.id as string, req.body);
    res.status(201).json({ success: true, data: newOrder });
  });

  getHistory = wrap(async (req, res) => {
    const history = await this.service.getHistory(req.params.id as string);
    res.json({ success: true, data: history });
  });

  getVersions = wrap(async (req, res) => {
    const versions = await this.service.getVersions(req.params.id as string);
    res.json({ success: true, data: versions });
  });

  getByTable = wrap(async (req, res) => {
    const data = await this.service.findByTable(req.params.mesaId as string);
    res.json({ success: true, data });
  });

  updateStatus = wrap(async (req, res) => {
    if (req.body.status === 'COMPLETED' && req.user?.role !== 'ADMIN') {
      throw new ForbiddenError('Only admins can mark orders as delivered');
    }
    const data = await this.service.updateStatus(req.params.id as string, req.body.status);
    res.json({ success: true, data });
  });

  getPendingApproval = wrap(async (req, res) => {
    const data = await this.service.findPendingApproval();
    res.json({ success: true, data });
  });

  cancel = wrap(async (req, res) => {
    const data = await this.service.cancel(req.params.id as string);
    res.json({ success: true, data });
  });
}
