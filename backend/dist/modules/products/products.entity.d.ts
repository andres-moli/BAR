import { Category } from '../categories/categories.entity';
import { OrderItem } from '../orders/order-item.entity';
import { Movement } from './movement.entity';
export declare class Product {
    id: string;
    name: string;
    description: string;
    price: number;
    cost: number;
    categoryId: string;
    category: Category;
    isActive: boolean;
    stock: number;
    imageUrl: string;
    createdAt: Date;
    updatedAt: Date;
    orderItems: OrderItem[];
    movements: Movement[];
}
//# sourceMappingURL=products.entity.d.ts.map