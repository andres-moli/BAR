import { Repository } from 'typeorm';
import { Payment } from './payments.entity';
import { Invoice } from './invoice.entity';
import { Order, OrderStatus } from '../orders/orders.entity';
import { TableEntity, TableStatus } from '../tables/tables.entity';
import { CashRegister, CashRegisterStatus } from '../cash-register/cash-register.entity';
import { CashMovement } from '../cash-register/cash-movement.entity';
import { PaymentMethod } from '../payment-methods/payment-methods.entity';
import { NotFoundError, ConflictError } from '../../shared/errors';
import { ProcessPaymentDto } from './payments.dto';

export class PaymentsService {
  constructor(
    private paymentRepo: Repository<Payment>,
    private invoiceRepo: Repository<Invoice>,
    private orderRepo: Repository<Order>,
    private tableRepo: Repository<TableEntity>,
    private cashRegisterRepo: Repository<CashRegister>,
    private cashMovementRepo: Repository<CashMovement>,
    private paymentMethodRepo: Repository<PaymentMethod>,
  ) {}

  async processPayment(dto: ProcessPaymentDto): Promise<{ payment: Payment; invoice?: Invoice; orderCompleted: boolean }> {
    const order = await this.orderRepo.findOne({ where: { id: dto.orderId } });
    if (!order) throw new NotFoundError('Order not found');
    if (order.status === OrderStatus.CANCELLED) throw new ConflictError('Cannot pay a cancelled order');
    if (order.status === OrderStatus.PAID) throw new ConflictError('Order is already paid');

    const payment = this.paymentRepo.create({
      orderId: dto.orderId,
      amount: dto.amount,
      paymentMethodId: dto.paymentMethodId,
      reference: dto.reference,
      userId: dto.userId,
    });
    await this.paymentRepo.save(payment);

    // Create CashMovement linked to the current open cash register
    try {
      const openRegister = await this.cashRegisterRepo.findOne({ where: { status: CashRegisterStatus.OPEN } });
      if (openRegister) {
        const paymentMethod = await this.paymentMethodRepo.findOne({ where: { id: dto.paymentMethodId }, relations: ['account'] });
        const movement = this.cashMovementRepo.create({
          cashRegisterId: openRegister.id,
          accountId: paymentMethod?.accountId || '1',
          amount: dto.amount,
          type: 'INCOME',
          description: `Pago pedido #${dto.orderId}`,
          reference: dto.reference || null,
          paymentId: payment.id,
        });
        await this.cashMovementRepo.save(movement);
      }
    } catch (err) {
      // Non-critical: log but don't fail the payment
      console.error('Error creating cash movement:', err);
    }

    const totalPaid = await this.getTotalPaid(dto.orderId);
    const remaining = Number(order.total) - totalPaid;
    let invoice: Invoice | undefined;
    let orderCompleted = false;

    if (remaining <= 0) {
      order.status = OrderStatus.PAID;
      order.closedAt = new Date();
      await this.orderRepo.save(order);

      if (order.tableId) {
        await this.tableRepo.update(order.tableId, { status: TableStatus.AVAILABLE });
      }

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
      relations: ['table', 'user', 'items', 'items.product', 'subOrders', 'subOrders.creator', 'payments'],
      order: { createdAt: 'DESC' },
    });
  }

  async getOrderBillingDetail(orderId: string): Promise<Order> {
    const order = await this.orderRepo.findOne({
      where: { id: orderId },
      relations: ['table', 'user', 'client', 'items', 'items.product', 'subOrders', 'subOrders.creator', 'payments', 'payments.paymentMethod'],
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
    if (order.status !== OrderStatus.COMPLETED && order.status !== OrderStatus.PAID)
      throw new ConflictError('Order must be completed or paid before invoicing');

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
