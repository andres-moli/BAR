import { Repository } from 'typeorm';
import { Account } from './accounts.entity';
import { CreateAccountDto, UpdateAccountDto } from './accounts.dto';
export declare class AccountsService {
    private repo;
    constructor(repo: Repository<Account>);
    findAll(includeInactive?: boolean): Promise<Account[]>;
    findById(id: string): Promise<Account>;
    create(data: CreateAccountDto): Promise<Account>;
    update(id: string, data: UpdateAccountDto): Promise<Account>;
    delete(id: string): Promise<void>;
}
//# sourceMappingURL=accounts.service.d.ts.map