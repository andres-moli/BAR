import { Repository } from 'typeorm';
import { Client } from './clients.entity';
import { Order } from '../orders/orders.entity';
import { CollectionAccount } from '../collections/collections.entity';
import { CreateClientDto, UpdateClientDto } from './clients.dto';
export declare class ClientsService {
    private repo;
    private orderRepo;
    private collectionRepo;
    constructor(repo: Repository<Client>, orderRepo: Repository<Order>, collectionRepo: Repository<CollectionAccount>);
    findAll(): Promise<Client[]>;
    findById(id: string): Promise<Client>;
    create(dto: CreateClientDto): Promise<Client>;
    update(id: string, dto: UpdateClientDto): Promise<Client>;
    delete(id: string): Promise<void>;
    getHistory(id: string): Promise<{
        client: Client;
        orders: Order[];
        collectionAccounts: CollectionAccount[];
    }>;
}
//# sourceMappingURL=clients.service.d.ts.map