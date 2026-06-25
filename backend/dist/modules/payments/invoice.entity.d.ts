import { Order } from '../orders/orders.entity';
export declare class Invoice {
    id: string;
    invoiceNumber: string;
    subtotal: number;
    tax: number;
    total: number;
    discount: number;
    nit: string;
    name: string;
    email: string;
    orderId: string;
    order: Order;
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=invoice.entity.d.ts.map