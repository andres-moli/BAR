import { Repository } from 'typeorm';
import { Payment } from './payments.entity';
import { Invoice } from './invoice.entity';
import { Order, OrderStatus } from '../orders/orders.entity';
import { NotFoundError, ConflictError } from '../../shared/errors';
import { ProcessPaymentDto } from './payments.dto';

export class PaymentsService {
  constructor(
    private paymentRepo: Repository<Payment>,
    private invoiceRepo: Repository<Invoice>,
    private orderRepo: Repository<Order>,
  ) {}

  async processPayment(dto: ProcessPaymentDto): Promise<{ payment: Payment; invoice?: Invoice; orderCompleted: boolean }> {
    const order = await this.orderRepo.findOne({ where: { id: dto.orderId }, relations: ['payments'] });
    if (!order) throw new NotFoundError('Order not found');
    if (order.status === OrderStatus.CANCELLED) throw new ConflictError('Cannot pay a cancelled order');
    if (order.status === OrderStatus.COMPLETED) throw new ConflictError('Order is already completed');

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
    let invoice: Invoice | undefined;
    let orderCompleted = false;

    if (remaining <= 0) {
      order.status = OrderStatus.COMPLETED;
      order.closedAt = new Date();
      await this.orderRepo.save(order);

      invoice = await this.generateInvoice(order, dto);
      orderCompleted = true;
    }

    const savedPayment = await this.paymentRepo.findOne({
      where: { id: payment.id },
      relations: ['paymentMethod', 'user'],
    });

    return { payment: savedPayment!, invoice, orderCompleted };
  }

  async getByOrder(orderId: string): Promise<Payment[]> {
    return this.paymentRepo.find({
      where: { orderId },
      relations: ['paymentMethod', 'user'],
      order: { createdAt: 'DESC' },
    });
  }

  private async getTotalPaid(orderId: string): Promise<number> {
    const result = await this.paymentRepo
      .createQueryBuilder('payment')
      .select('COALESCE(SUM(payment.amount), 0)', 'total')
      .where('payment.orderId = :orderId', { orderId })
      .getRawOne();
    return Number(result?.total || 0);
  }

  async getPendingOrders(): Promise<Order[]> {
    return this.orderRepo.find({
      where: { status: 'COMPLETED' as OrderStatus },
      relations: ['table', 'user', 'items', 'items.product', 'payments'],
      order: { createdAt: 'DESC' },
    });
  }

  async getOrderBillingDetail(orderId: string): Promise<Order> {
    const order = await this.orderRepo.findOne({
      where: { id: orderId },
      relations: ['table', 'user', 'client', 'items', 'items.product', 'payments', 'payments.paymentMethod'],
    });
    if (!order) throw new NotFoundError('Order not found');
    return order;
  }

  async generateInvoiceFromOrder(orderId: string): Promise<Invoice> {
    const order = await this.orderRepo.findOne({
      where: { id: orderId },
      relations: ['invoice'],
    });
    if (!order) throw new NotFoundError('Order not found');
    if (order.invoice) throw new ConflictError('Invoice already exists for this order');
    if (order.status !== OrderStatus.COMPLETED) throw new ConflictError('Order must be completed before invoicing');

    const invoiceNumber = `INV-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const invoice = this.invoiceRepo.create({
      invoiceNumber,
      subtotal: order.subtotal,
      tax: order.tax,
      total: order.total,
      discount: order.discount,
      orderId: order.id,
    } as any);

    return this.invoiceRepo.save(invoice as any);
  }

  private async generateInvoice(order: Order, dto: ProcessPaymentDto): Promise<Invoice> {
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
    } as any);

    return this.invoiceRepo.save(invoice as any);
  }
}
