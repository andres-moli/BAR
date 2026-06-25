import { PaymentMethod } from '../payment-methods/payment-methods.entity';
import { Order } from '../orders/orders.entity';
import { User } from '../users/users.entity';
export declare class Payment {
    id: string;
    amount: number;
    paymentMethodId: string;
    paymentMethod: PaymentMethod;
    reference: string;
    orderId: string;
    order: Order;
    userId: string;
    user: User;
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=payments.entity.d.ts.map