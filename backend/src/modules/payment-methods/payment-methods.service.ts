import { Repository } from 'typeorm';
import { PaymentMethod } from './payment-methods.entity';
import { CreatePaymentMethodDto, UpdatePaymentMethodDto } from './payment-methods.dto';
import { NotFoundError, ConflictError } from '../../shared/errors';

export class PaymentMethodsService {
  constructor(private repo: Repository<PaymentMethod>) {}

  async findAll(includeInactive = false): Promise<PaymentMethod[]> {
    const where = includeInactive ? {} : { isActive: true };
    return this.repo.find({ where, relations: ['account'], order: { name: 'ASC' } });
  }

  async findById(id: string): Promise<PaymentMethod> {
    const method = await this.repo.findOne({ where: { id }, relations: ['account'] });
    if (!method) throw new NotFoundError('Payment method not found');
    return method;
  }

  async getByAccount(accountId: string): Promise<PaymentMethod[]> {
    return this.repo.find({ where: { accountId, isActive: true }, order: { name: 'ASC' } });
  }

  async create(data: CreatePaymentMethodDto): Promise<PaymentMethod> {
    const existing = await this.repo.findOne({ where: { name: data.name } });
    if (existing) throw new ConflictError('Payment method with this name already exists');
    const method = this.repo.create(data);
    return this.repo.save(method);
  }

  async update(id: string, data: UpdatePaymentMethodDto): Promise<PaymentMethod> {
    const method = await this.findById(id);
    if (data.name && data.name !== method.name) {
      const existing = await this.repo.findOne({ where: { name: data.name } });
      if (existing) throw new ConflictError('Payment method with this name already exists');
    }
    Object.assign(method, data);
    return this.repo.save(method);
  }

  async delete(id: string): Promise<void> {
    const method = await this.findById(id);
    await this.repo.remove(method);
  }
}
