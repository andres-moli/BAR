import { Request, Response, NextFunction } from 'express';
import { PrintService } from './print.service';

const wrap = (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) =>
  (req: Request, res: Response, next: NextFunction) => fn(req, res, next).catch(next);

export class PrintController {
  constructor(private service: PrintService) {}

  printOrderHandler = wrap(async (req, res) => {
    const data = await this.service.printOrder(req.body.orderId);
    res.json({ success: true, data });
  });

  printPreBillHandler = wrap(async (req, res) => {
    const data = await this.service.printPreBill(req.body.orderId);
    res.json({ success: true, data });
  });

  printInvoiceHandler = wrap(async (req, res) => {
    const data = await this.service.printInvoice(req.body.orderId);
    res.json({ success: true, data });
  });

  printCollectionHandler = wrap(async (req, res) => {
    const data = await this.service.printCollectionAccount(req.body.collectionId);
    res.json({ success: true, data });
  });
}
