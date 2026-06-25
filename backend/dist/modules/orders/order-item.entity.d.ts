import { Order } from './orders.entity';
import { Product } from '../products/products.entity';
export declare class OrderItem {
    id: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
    notes: string;
    orderId: string;
    order: Order;
    productId: string;
    product: Product;
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=order-item.entity.d.ts.map