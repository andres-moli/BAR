"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrintController = void 0;
const wrap = (fn) => (req, res, next) => fn(req, res, next).catch(next);
class PrintController {
    service;
    constructor(service) {
        this.service = service;
    }
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
exports.PrintController = PrintController;
//# sourceMappingURL=print.controller.js.map