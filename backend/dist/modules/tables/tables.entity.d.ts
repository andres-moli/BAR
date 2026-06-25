import { Order } from '../orders/orders.entity';
export declare enum TableStatus {
    AVAILABLE = "AVAILABLE",
    OCCUPIED = "OCCUPIED",
    RESERVED = "RESERVED"
}
export declare class TableEntity {
    id: string;
    number: number;
    status: TableStatus;
    capacity: number;
    location: string;
    createdAt: Date;
    updatedAt: Date;
    orders: Order[];
}
//# sourceMappingURL=tables.entity.d.ts.map