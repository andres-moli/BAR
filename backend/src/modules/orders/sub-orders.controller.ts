import { Request, Response, NextFunction, Handler } from 'express';
import { SubOrdersService } from './sub-orders.service';

const wrap = (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) =>
  (req: Request, res: Response, next: NextFunction): Promise<void> => fn(req, res, next).catch(next);

export class SubOrdersController {
  constructor(private service: SubOrdersService) {}

  create = wrap(async (req: Request, res: Response) => {
    const orderId = req.params.orderId as string;
    const userId = req.user!.id;
    const result = await this.service.create(orderId, userId);
    res.status(201).json({ success: true, data: result });
  });

  confirm = wrap(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const result = await this.service.confirm(id);
    res.json({ success: true, data: result });
  });

  deliver = wrap(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const userId = req.user!.id;
    const result = await this.service.deliver(id, userId);
    res.json({ success: true, data: result });
  });

  getPending = wrap(async (_req: Request, res: Response) => {
    const result = await this.service.getPending();
    res.json({ success: true, data: result });
  });

  getByOrder = wrap(async (req: Request, res: Response) => {
    const orderId = req.params.orderId as string;
    const result = await this.service.getByOrder(orderId);
    res.json({ success: true, data: result });
  });

  getItems = wrap(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const result = await this.service.getItems(id);
    res.json({ success: true, data: result });
  });
}
