import { Product } from './products.entity';
import { User } from '../users/users.entity';
export declare class Movement {
    id: string;
    type: string;
    quantity: number;
    description: string;
    productId: string;
    product: Product;
    userId: string;
    user: User;
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=movement.entity.d.ts.map