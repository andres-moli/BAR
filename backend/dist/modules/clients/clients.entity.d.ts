import { Order } from '../orders/orders.entity';
import { CollectionAccount } from '../collections/collections.entity';
export declare class Client {
    id: string;
    name: string;
    email: string;
    phone: string;
    document: string;
    address: string;
    createdAt: Date;
    updatedAt: Date;
    orders: Order[];
    collectionAccounts: CollectionAccount[];
}
//# sourceMappingURL=clients.entity.d.ts.map