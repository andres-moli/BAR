import { Repository } from 'typeorm';
import { Client } from './clients.entity';
import { Order } from '../orders/orders.entity';
import { CollectionAccount } from '../collections/collections.entity';
import { NotFoundError } from '../../shared/errors';
import { CreateClientDto, UpdateClientDto } from './clients.dto';

export class ClientsService {
  constructor(
    private repo: Repository<Client>,
    private orderRepo: Repository<Order>,
    private collectionRepo: Repository<CollectionAccount>,
  ) {}

  async findAll(): Promise<Client[]> {
    return this.repo.find({ order: { name: 'ASC' } });
  }

  async findById(id: string): Promise<Client> {
    const client = await this.repo.findOne({ where: { id } });
    if (!client) throw new NotFoundError('Client not found');
    return client;
  }

  async create(dto: CreateClientDto): Promise<Client> {
    const client = this.repo.create(dto);
    return this.repo.save(client);
  }

  async update(id: string, dto: UpdateClientDto): Promise<Client> {
    const client = await this.findById(id);
    Object.assign(client, dto);
    return this.repo.save(client);
  }

  async delete(id: string): Promise<void> {
    const client = await this.findById(id);
    await this.repo.remove(client);
  }

  async getOrders(clientId: string): Promise<Order[]> {
    return this.orderRepo.find({
      where: { clientId },
      relations: ['items', 'items.product', 'payments'],
      order: { createdAt: 'DESC' },
    });
  }

  async getCollectionAccounts(clientId: string): Promise<CollectionAccount[]> {
    return this.collectionRepo.find({
      where: { clientId },
      relations: ['payments'],
      order: { createdAt: 'DESC' },
    });
  }

  async getHistory(id: string): Promise<{ client: Client; orders: Order[]; collectionAccounts: CollectionAccount[] }> {
    const client = await this.findById(id);
    const orders = await this.getOrders(id);
    const collectionAccounts = await this.getCollectionAccounts(id);
    return { client, orders, collectionAccounts };
  }
}
