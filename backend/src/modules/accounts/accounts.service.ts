import { Repository } from 'typeorm';
import { Account } from './accounts.entity';
import { CreateAccountDto, UpdateAccountDto } from './accounts.dto';
import { NotFoundError, ConflictError } from '../../shared/errors';

export class AccountsService {
  constructor(private repo: Repository<Account>) {}

  async findAll(includeInactive = false): Promise<Account[]> {
    const where = includeInactive ? {} : { isActive: true };
    return this.repo.find({ where, order: { name: 'ASC' } });
  }

  async findById(id: string): Promise<Account> {
    const account = await this.repo.findOne({ where: { id } });
    if (!account) throw new NotFoundError('Account not found');
    return account;
  }

  async create(data: CreateAccountDto): Promise<Account> {
    const existing = await this.repo.findOne({ where: { name: data.name } });
    if (existing) throw new ConflictError('Account with this name already exists');
    const account = this.repo.create(data as any) as unknown as Account;
    return this.repo.save(account);
  }

  async update(id: string, data: UpdateAccountDto): Promise<Account> {
    const account = await this.findById(id);
    if (data.name && data.name !== account.name) {
      const existing = await this.repo.findOne({ where: { name: data.name } });
      if (existing) throw new ConflictError('Account with this name already exists');
    }
    Object.assign(account, data);
    return this.repo.save(account);
  }

  async delete(id: string): Promise<void> {
    const account = await this.findById(id);
    await this.repo.remove(account);
  }
}
