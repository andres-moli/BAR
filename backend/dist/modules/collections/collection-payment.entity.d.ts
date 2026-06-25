import { CollectionAccount } from './collections.entity';
import { PaymentMethod } from '../payment-methods/payment-methods.entity';
export declare class CollectionPayment {
    id: string;
    amount: number;
    paymentMethodId: string;
    paymentMethod: PaymentMethod;
    reference: string;
    collectionAccountId: string;
    collectionAccount: CollectionAccount;
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=collection-payment.entity.d.ts.map