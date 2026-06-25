import { Client } from '../clients/clients.entity';
import { CollectionPayment } from './collection-payment.entity';
export declare enum CollectionStatus {
    PENDING = "PENDING",
    PARTIALLY_PAID = "PARTIALLY_PAID",
    PAID = "PAID"
}
export declare class CollectionAccount {
    id: string;
    totalAmount: number;
    paidAmount: number;
    status: CollectionStatus;
    notes: string;
    clientId: string;
    client: Client;
    payments: CollectionPayment[];
    createdAt: Date;
    updatedAt: Date;
    dueDate: Date;
}
//# sourceMappingURL=collections.entity.d.ts.map