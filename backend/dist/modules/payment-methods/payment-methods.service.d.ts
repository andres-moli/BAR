import { Repository } from 'typeorm';
import { PaymentMethod } from './payment-methods.entity';
import { CreatePaymentMethodDto, UpdatePaymentMethodDto } from './payment-methods.dto';
export declare class PaymentMethodsService {
    private repo;
    constructor(repo: Repository<PaymentMethod>);
    findAll(includeInactive?: boolean): Promise<PaymentMethod[]>;
    findById(id: string): Promise<PaymentMethod>;
    getByAccount(accountId: string): Promise<PaymentMethod[]>;
    create(data: CreatePaymentMethodDto): Promise<PaymentMethod>;
    update(id: string, data: UpdatePaymentMethodDto): Promise<PaymentMethod>;
    delete(id: string): Promise<void>;
}
//# sourceMappingURL=payment-methods.service.d.ts.map