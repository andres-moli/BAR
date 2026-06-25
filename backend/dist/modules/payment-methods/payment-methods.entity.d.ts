import { Account } from '../accounts/accounts.entity';
import { Payment } from '../payments/payments.entity';
import { CollectionPayment } from '../collections/collection-payment.entity';
export declare class PaymentMethod {
    id: string;
    name: string;
    accountId: string;
    account: Account;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    payments: Payment[];
    collectionPayments: CollectionPayment[];
}
//# sourceMappingURL=payment-methods.entity.d.ts.map