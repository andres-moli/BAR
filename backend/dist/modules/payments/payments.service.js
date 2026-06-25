"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const orders_entity_1 = require("../orders/orders.entity");
const errors_1 = require("../../shared/errors");
class PaymentsService {
    paymentRepo;
    invoiceRepo;
    orderRepo;
    constructor(paymentRepo, invoiceRepo, orderRepo) {
        this.paymentRepo = paymentRepo;
        this.invoiceRepo = invoiceRepo;
        this.orderRepo = orderRepo;
    }
    async processPayment(dto) {
        const order = await this.orderRepo.findOne({ where: { id: dto.orderId }, relations: ['payments'] });
        if (!order)
            throw new errors_1.NotFoundError('Order not found');
        if (order.status === orders_entity_1.OrderStatus.CANCELLED)
            throw new errors_1.ConflictError('Cannot pay a cancelled order');
        if (order.status === orders_entity_1.OrderStatus.COMPLETED)
            throw new errors_1.ConflictError('Order is already completed');
        const payment = this.paymentRepo.create({
            orderId: dto.orderId,
            amount: dto.amount,
            paymentMethodId: dto.paymentMethodId,
            reference: dto.reference,
            userId: dto.userId,
        });
        await this.paymentRepo.save(payment);
        const totalPaid = await this.getTotalPaid(dto.orderId);
        const remaining = Number(order.total) - totalPaid;
        let invoice;
        let orderCompleted = false;
        if (remaining <= 0) {
            order.status = orders_entity_1.OrderStatus.COMPLETED;
            order.closedAt = new Date();
            await this.orderRepo.save(order);
            invoice = await this.generateInvoice(order, dto);
            orderCompleted = true;
        }
        const savedPayment = await this.paymentRepo.findOne({
            where: { id: payment.id },
            relations: ['paymentMethod', 'user'],
        });
        return { payment: savedPayment, invoice, orderCompleted };
    }
    async getByOrder(orderId) {
        return this.paymentRepo.find({
            where: { orderId },
            relations: ['paymentMethod', 'user'],
            order: { createdAt: 'DESC' },
        });
    }
    async getTotalPaid(orderId) {
        const result = await this.paymentRepo
            .createQueryBuilder('payment')
            .select('COALESCE(SUM(payment.amount), 0)', 'total')
            .where('payment.orderId = :orderId', { orderId })
            .getRawOne();
        return Number(result?.total || 0);
    }
    async generateInvoice(order, dto) {
        const invoiceNumber = `INV-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
        const invoice = this.invoiceRepo.create({
            invoiceNumber,
            subtotal: order.subtotal,
            tax: order.tax,
            total: order.total,
            discount: order.discount,
            nit: dto.nit || null,
            name: dto.name || null,
            email: dto.email || null,
            orderId: order.id,
        });
        return this.invoiceRepo.save(invoice);
    }
}
exports.PaymentsService = PaymentsService;
//# sourceMappingURL=payments.service.js.map