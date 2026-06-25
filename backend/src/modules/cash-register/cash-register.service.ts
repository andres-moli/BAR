import { Repository } from 'typeorm';
import { CashRegister, CashRegisterStatus } from './cash-register.entity';
import { CashMovement } from './cash-movement.entity';
import { OpenCashRegisterDto, CashRegisterSummaryDto } from './cash-register.dto';
import { NotFoundError, ConflictError } from '../../shared/errors';

export class CashRegisterService {
  constructor(
    private repo: Repository<CashRegister>,
    private movementRepo: Repository<CashMovement>,
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

  async close(id: string, userId: string): Promise<CashRegister> {
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

  async getHistory(page = 1, limit = 20): Promise<{ data: CashRegister[]; total: number }> {
    const [data, total] = await this.repo.findAndCount({
      order: { date: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total };
  }

  async getSummary(registerId: string): Promise<CashRegisterSummaryDto[]> {
    const movements = await this.movementRepo.find({
      where: { cashRegisterId: registerId },
      relations: ['account'],
    });
    const grouped: Record<string, { accountName: string; totalAmount: number }> = {};
    for (const m of movements) {
      const key = m.accountId;
      if (!grouped[key]) {
        grouped[key] = { accountName: m.account?.name || 'Unknown', totalAmount: 0 };
      }
      grouped[key].totalAmount += Number(m.amount);
    }
    return Object.entries(grouped).map(([accountId, data]) => ({
      accountId,
      accountName: data.accountName,
      totalAmount: data.totalAmount,
    }));
  }
}
