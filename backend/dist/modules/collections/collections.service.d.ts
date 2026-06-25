import { Repository } from 'typeorm';
import { CollectionAccount } from './collections.entity';
import { CollectionPayment } from './collection-payment.entity';
import { CreateCollectionDto, RegisterPaymentDto } from './collections.dto';
export declare class CollectionsService {
    private repo;
    private paymentRepo;
    constructor(repo: Repository<CollectionAccount>, paymentRepo: Repository<CollectionPayment>);
    findAll(): Promise<CollectionAccount[]>;
    findById(id: string): Promise<CollectionAccount>;
    create(data: CreateCollectionDto): Promise<CollectionAccount>;
    registerPayment(id: string, data: RegisterPaymentDto): Promise<CollectionPayment>;
    getHistory(clientId: string): Promise<CollectionAccount[]>;
}
//# sourceMappingURL=collections.service.d.ts.map