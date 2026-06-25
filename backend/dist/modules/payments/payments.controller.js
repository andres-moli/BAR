"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentController = void 0;
const wrap = (fn) => (req, res, next) => fn(req, res, next).catch(next);
class PaymentController {
    service;
    constructor(service) {
        this.service = service;
    }
    processPayment = wrap(async (req, res) => {
        const result = await this.service.processPayment({ ...req.body, userId: req.user.id });
        res.status(201).json({ success: true, data: result });
    });
    getByOrder = wrap(async (req, res) => {
        const payments = await this.service.getByOrder(req.params.orderId);
        res.json({ success: true, data: payments });
    });
    getPaymentMethods = wrap(async (_req, res) => {
        const methods = ['CASH', 'DEBIT_CARD', 'CREDIT_CARD', 'TRANSFER', 'NEQUI', 'DAVIPLATA', 'OTHER'];
        res.json({ success: true, data: methods });
    });
}
exports.PaymentController = PaymentController;
//# sourceMappingURL=payments.controller.js.map