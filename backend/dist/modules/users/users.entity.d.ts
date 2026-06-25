import { Order } from '../orders/orders.entity';
import { Payment } from '../payments/payments.entity';
export declare enum UserRole {
    ADMIN = "ADMIN",
    CASHIER = "CASHIER",
    WAITER = "WAITER"
}
export declare class User {
    id: string;
    email: string;
    password: string;
    name: string;
    role: UserRole;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    orders: Order[];
    payments: Payment[];
}
//# sourceMappingURL=users.entity.d.ts.map