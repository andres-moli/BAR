import { Repository, In } from 'typeorm';
import { CashRegister, CashRegisterStatus } from './cash-register.entity';
import { CashMovement } from './cash-movement.entity';
import { OpenCashRegisterDto, CashRegisterSummaryDto } from './cash-register.dto';
import { NotFoundError, ConflictError } from '../../shared/errors';

export class CashRegisterService {
  constructor(
    private repo: Repository<CashRegister>,
    private movementRepo: Repository<CashMovement>,
    private paymentRepo: any,
    private orderRepo: any,
  ) {}

  async open(data: OpenCashRegisterDto, userId: string): Promise<CashRegister> {
    const openRegister = await this.repo.findOne({ where: { status: CashRegisterStatus.OPEN } });
    if (openRegister) throw new ConflictError('There is already an open cash register');
    const register = this.repo.create({
      initialAmount: data.initialAmount,
      notes: data.notes,
      openedBy: userId,
      status: CashRegisterStatus.OPEN,
    });
    return this.repo.save(register);
  }

  async close(id: string, userId: string, notes?: string): Promise<CashRegister> {
    const register = await this.repo.findOne({ where: { id } });
    if (!register) throw new NotFoundError('Cash register not found');
    if (register.status === CashRegisterStatus.CLOSED) throw new ConflictError('Cash register is already closed');
    const movements = await this.movementRepo.find({ where: { cashRegisterId: id } });
    const totalMovements = movements.reduce((sum, m) => sum + Number(m.amount), 0);
    const finalAmount = Number(register.initialAmount) + totalMovements;
    register.finalAmount = finalAmount;
    register.closedBy = userId;
    register.closedAt = new Date();
    register.status = CashRegisterStatus.CLOSED;
    if (notes) register.notes = notes;
    return this.repo.save(register);
  }

  async getCurrent(): Promise<CashRegister | null> {
    return this.repo.findOne({
      where: { status: CashRegisterStatus.OPEN },
      relations: ['movements'],
    });
  }

  async getMovements(registerId: string): Promise<CashMovement[]> {
    return this.movementRepo.find({
      where: { cashRegisterId: registerId },
      relations: ['account'],
      order: { createdAt: 'DESC' },
    });
  }

  async getHistory(page = 1, limit = 20): Promise<{ data: any[]; total: number }> {
    const [registers, total] = await this.repo.findAndCount({
      order: { date: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
      relations: ['movements'],
    });
    const data = registers.map(r => {
      const j = r.toJSON();
      const entrance = (r.movements || [])
        .filter(m => Number(m.amount) >= 0)
        .reduce((sum, m) => sum + Number(m.amount), 0);
      const exit = (r.movements || [])
        .filter(m => Number(m.amount) < 0)
        .reduce((sum, m) => sum + Math.abs(Number(m.amount)), 0);
      return { ...j, totalEntrance: entrance, totalExit: exit };
    });
    return { data, total };
  }

  async getSummary(registerId: string): Promise<CashRegisterSummaryDto[]> {
    const movements = await this.movementRepo.find({
      where: { cashRegisterId: registerId },
      relations: ['account'],
    });
    const grouped: Record<string, { accountName: string; totalAmount: number; type: string }> = {};
    for (const m of movements) {
      const key = m.accountId;
      if (!grouped[key]) {
        grouped[key] = { accountName: m.account?.name || 'Unknown', totalAmount: 0, type: m.account?.type || 'OTHER' };
      }
      grouped[key].totalAmount += Number(m.amount);
    }
    return Object.entries(grouped).map(([accountId, data]) => ({
      accountId,
      accountName: data.accountName,
      totalAmount: data.totalAmount,
      type: data.type,
    }));
  }

  async getWaiterReport(registerId: string): Promise<{ waiters: any[] }> {
    const movements = await this.movementRepo.find({
      where: { cashRegisterId: registerId, type: 'INCOME' },
    });
    const paymentIds = movements.filter(m => m.paymentId).map(m => m.paymentId);
    if (paymentIds.length === 0) return { waiters: [] };

    const payments = await this.paymentRepo.find({
      where: { id: In(paymentIds) },
      relations: ['user', 'order', 'order.items', 'order.items.product', 'order.table'],
    });

    const byUser: Record<string, any> = {};
    for (const payment of payments) {
      const userId = payment.userId;
      const userName = payment.user?.nombre || payment.user?.name || 'Desconocido';
      if (!byUser[userId]) {
        byUser[userId] = { userId, userName, totalSales: 0, products: {}, orders: [] };
      }
      const entry = byUser[userId];
      entry.totalSales += Number(payment.amount);
      if (payment.order?.items) {
        for (const item of payment.order.items) {
          const productName = item.comboName || item.product?.name || `Producto #${item.productId}`;
          if (!entry.products[productName]) {
            entry.products[productName] = { productName, quantity: 0, total: 0 };
          }
          entry.products[productName].quantity += item.quantity;
          entry.products[productName].total += Number(item.subtotal);
        }
      }
      entry.orders.push({
        orderId: payment.orderId,
        tableNumber: payment.order?.table?.numero || payment.order?.table?.number || null,
        total: Number(payment.amount),
      });
    }

    const waiters = Object.values(byUser).map((w: any) => ({
      ...w,
      products: Object.values(w.products),
    }));

    return { waiters };
  }
}
