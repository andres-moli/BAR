import { Repository } from 'typeorm';
import { CollectionAccount, CollectionStatus } from './collections.entity';
import { CollectionPayment } from './collection-payment.entity';
import { CreateCollectionDto, RegisterPaymentDto } from './collections.dto';
import { NotFoundError } from '../../shared/errors';

export class CollectionsService {
  constructor(
    private repo: Repository<CollectionAccount>,
    private paymentRepo: Repository<CollectionPayment>,
  ) {}

  async findAll(): Promise<CollectionAccount[]> {
    return this.repo.find({ relations: ['client'] });
  }

  async findById(id: string): Promise<CollectionAccount> {
    const collection = await this.repo.findOne({
      where: { id },
      relations: ['client', 'payments', 'payments.paymentMethod'],
    });
    if (!collection) throw new NotFoundError('Collection account not found');
    return collection;
  }

  async create(data: CreateCollectionDto): Promise<CollectionAccount> {
    const collection = this.repo.create({
      clientId: data.clientId,
      totalAmount: data.totalAmount,
      paidAmount: 0,
      status: CollectionStatus.PENDING,
      notes: data.notes,
      dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
    });
    return this.repo.save(collection);
  }

  async registerPayment(id: string, data: RegisterPaymentDto): Promise<CollectionPayment> {
    const collection = await this.repo.findOne({ where: { id } });
    if (!collection) throw new NotFoundError('Collection account not found');

    const payment = this.paymentRepo.create({
      collectionAccountId: id,
      amount: data.amount,
      paymentMethodId: data.paymentMethodId,
      reference: data.reference,
    });
    const saved = await this.paymentRepo.save(payment);

    const totalPaid = Number(collection.paidAmount) + Number(data.amount);
    const totalAmount = Number(collection.totalAmount);

    let newStatus: CollectionStatus;
    if (totalPaid >= totalAmount) {
      newStatus = CollectionStatus.PAID;
    } else if (totalPaid > 0) {
      newStatus = CollectionStatus.PARTIALLY_PAID;
    } else {
      newStatus = CollectionStatus.PENDING;
    }

    await this.repo.update(id, { paidAmount: totalPaid, status: newStatus });
    return saved;
  }

  async getHistory(clientId: string): Promise<CollectionAccount[]> {
    return this.repo.find({
      where: { clientId },
      relations: ['payments'],
      order: { createdAt: 'DESC' },
    });
  }
}
