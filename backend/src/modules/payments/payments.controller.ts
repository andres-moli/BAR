import { Request, Response, NextFunction } from 'express';
import { PaymentsService } from './payments.service';

const wrap = (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) =>
  (req: Request, res: Response, next: NextFunction) => fn(req, res, next).catch(next);

export class PaymentController {
  constructor(private service: PaymentsService) {}

  processPayment = wrap(async (req, res) => {
    const result = await this.service.processPayment({ ...req.body, userId: req.user!.id });
    res.status(201).json({ success: true, data: result });
  });

  getByOrder = wrap(async (req, res) => {
    const payments = await this.service.getByOrder(req.params.orderId as string);
    res.json({ success: true, data: payments });
  });

  getPaymentMethods = wrap(async (_req, res) => {
    const methods = ['CASH', 'DEBIT_CARD', 'CREDIT_CARD', 'TRANSFER', 'NEQUI', 'DAVIPLATA', 'OTHER'];
    res.json({ success: true, data: methods });
  });

  getPending = wrap(async (_req, res) => {
    const data = await this.service.getPendingOrders();
    res.json({ success: true, data });
  });

  getOrderBillingDetail = wrap(async (req, res) => {
    const data = await this.service.getOrderBillingDetail(req.params.orderId as string);
    res.json({ success: true, data });
  });

  generateInvoice = wrap(async (req, res) => {
    const data = await this.service.generateInvoiceFromOrder(req.params.orderId as string);
    res.status(201).json({ success: true, data });
  });
}
