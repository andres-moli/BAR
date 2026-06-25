import { TableEntity } from '../tables/tables.entity';
import { User } from '../users/users.entity';
import { Client } from '../clients/clients.entity';
import { OrderItem } from './order-item.entity';
import { Payment } from '../payments/payments.entity';
import { Invoice } from '../payments/invoice.entity';
export declare enum OrderStatus {
    OPEN = "OPEN",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED"
}
export declare class Order {
    id: string;
    status: OrderStatus;
    notes: string;
    subtotal: number;
    tax: number;
    total: number;
    discount: number;
    tableId: string;
    table: TableEntity;
    userId: string;
    user: User;
    clientId: string;
    client: Client;
    items: OrderItem[];
    payments: Payment[];
    invoice: Invoice;
    createdAt: Date;
    updatedAt: Date;
    closedAt: Date;
}
//# sourceMappingURL=orders.entity.d.ts.map