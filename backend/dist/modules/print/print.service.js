"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrintService = void 0;
const errors_1 = require("../../shared/errors");
class PrintService {
    orderRepo;
    invoiceRepo;
    collectionRepo;
    constructor(orderRepo, invoiceRepo, collectionRepo) {
        this.orderRepo = orderRepo;
        this.invoiceRepo = invoiceRepo;
        this.collectionRepo = collectionRepo;
    }
    line(text, width = 42) {
        return text.padEnd(width) + '\n';
    }
    separator(char = '-', width = 42) {
        return char.repeat(width) + '\n';
    }
    center(text, width = 42) {
        const pad = Math.max(0, Math.floor((width - text.length) / 2));
        return ' '.repeat(pad) + text + '\n';
    }
    formatOrderLines(order) {
        let output = '';
        for (const item of order.items || []) {
            const name = item.product?.name || 'Unknown';
            const qty = item.quantity;
            const price = Number(item.price) || 0;
            const subtotal = Number(item.subtotal) || 0;
            output += `${name}\n`;
            output += `  ${qty} x $${price.toFixed(0)}    $${subtotal.toFixed(0)}\n`;
        }
        return output;
    }
    async printOrder(orderId) {
        const order = await this.orderRepo.findOne({
            where: { id: orderId },
            relations: ['items', 'items.product', 'table', 'user', 'client'],
        });
        if (!order)
            throw new errors_1.NotFoundError('Order not found');
        let output = '';
        output += this.center('=== ORDER TICKET ===');
        output += this.separator();
        output += this.line(`Order: ${order.id.slice(0, 8)}`);
        output += this.line(`Table: ${order.table?.number || 'N/A'}`);
        output += this.line(`Waiter: ${order.user?.name || 'N/A'}`);
        output += this.line(`Date: ${order.createdAt.toLocaleString()}`);
        output += this.separator();
        output += this.formatOrderLines(order);
        output += this.separator();
        output += this.line(`Subtotal: $${(Number(order.subtotal) || 0).toFixed(0)}`);
        output += this.line(`Tax: $${(Number(order.tax) || 0).toFixed(0)}`);
        output += this.line(`Total: $${(Number(order.total) || 0).toFixed(0)}`);
        output += this.separator();
        if (order.notes)
            output += this.line(`Notes: ${order.notes}`);
        output += this.center('Thank you!');
        return output;
    }
    async printPreBill(orderId) {
        const order = await this.orderRepo.findOne({
            where: { id: orderId },
            relations: ['items', 'items.product', 'table', 'user'],
        });
        if (!order)
            throw new errors_1.NotFoundError('Order not found');
        let output = '';
        output += this.center('=== PRE-BILL ===');
        output += this.separator();
        output += this.line(`Table: ${order.table?.number || 'N/A'}`);
        output += this.line(`Waiter: ${order.user?.name || 'N/A'}`);
        output += this.line(`Date: ${order.createdAt.toLocaleString()}`);
        output += this.separator('=');
        output += this.formatOrderLines(order);
        output += this.separator('=');
        output += this.line(`Subtotal: $${(Number(order.subtotal) || 0).toFixed(0)}`);
        output += this.line(`Discount: $${(Number(order.discount) || 0).toFixed(0)}`);
        output += this.line(`Tax (19%): $${(Number(order.tax) || 0).toFixed(0)}`);
        output += this.line(`TOTAL: $${(Number(order.total) || 0).toFixed(0)}`);
        output += this.separator();
        output += this.center('This is not an invoice');
        return output;
    }
    async printInvoice(invoiceId) {
        const invoice = await this.invoiceRepo.findOne({
            where: { id: invoiceId },
            relations: ['order', 'order.items', 'order.items.product', 'order.user'],
        });
        if (!invoice)
            throw new errors_1.NotFoundError('Invoice not found');
        let output = '';
        output += this.center('=== INVOICE ===');
        output += this.separator();
        output += this.line(`Invoice: ${invoice.invoiceNumber || invoice.id.slice(0, 8)}`);
        output += this.line(`Date: ${invoice.createdAt.toLocaleString()}`);
        output += this.line(`NIT: ${invoice.nit || 'N/A'}`);
        if (invoice.name)
            output += this.line(`Client: ${invoice.name}`);
        output += this.separator();
        if (invoice.order) {
            output += this.formatOrderLines(invoice.order);
        }
        output += this.separator();
        output += this.line(`Subtotal: $${(Number(invoice.subtotal) || 0).toFixed(0)}`);
        output += this.line(`Tax: $${(Number(invoice.tax) || 0).toFixed(0)}`);
        output += this.line(`TOTAL: $${(Number(invoice.total) || 0).toFixed(0)}`);
        output += this.separator();
        output += this.center('Thank you for your visit!');
        return output;
    }
    async printCollectionAccount(collectionId) {
        const collection = await this.collectionRepo.findOne({
            where: { id: collectionId },
            relations: ['client', 'payments', 'payments.paymentMethod'],
        });
        if (!collection)
            throw new errors_1.NotFoundError('Collection account not found');
        let output = '';
        output += this.center('=== COLLECTION ACCOUNT ===');
        output += this.separator();
        output += this.line(`Client: ${collection.client?.name || 'N/A'}`);
        output += this.line(`Date: ${collection.createdAt.toLocaleString()}`);
        output += this.line(`Due: ${collection.dueDate?.toLocaleDateString() || 'N/A'}`);
        output += this.separator();
        output += this.line(`Total: $${Number(collection.totalAmount).toFixed(0)}`);
        output += this.line(`Paid: $${Number(collection.paidAmount).toFixed(0)}`);
        output += this.line(`Balance: $${(Number(collection.totalAmount) - Number(collection.paidAmount)).toFixed(0)}`);
        output += this.line(`Status: ${collection.status}`);
        output += this.separator();
        if (collection.payments?.length) {
            output += this.center('-- Payments --');
            for (const p of collection.payments) {
                output += this.line(`${p.createdAt.toLocaleDateString()}  $${Number(p.amount).toFixed(0)}`);
                if (p.paymentMethod)
                    output += this.line(`  ${p.paymentMethod.name}`);
            }
            output += this.separator();
        }
        if (collection.notes)
            output += this.line(`Notes: ${collection.notes}`);
        output += this.center('Thank you!');
        return output;
    }
}
exports.PrintService = PrintService;
//# sourceMappingURL=print.service.js.map