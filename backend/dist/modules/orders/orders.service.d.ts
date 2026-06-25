import { Repository } from 'typeorm';
import { Order } from './orders.entity';
import { OrderItem } from './order-item.entity';
import { Product } from '../products/products.entity';
import { CreateOrderDto, AddItemDto, UpdateItemDto, SplitOrderDto } from './orders.dto';
export declare class OrdersService {
    private orderRepo;
    private itemRepo;
    private productRepo;
    constructor(orderRepo: Repository<Order>, itemRepo: Repository<OrderItem>, productRepo: Repository<Product>);
    findAll(filters?: {
        status?: string;
        tableId?: string;
        userId?: string;
        clientId?: string;
        startDate?: Date;
        endDate?: Date;
    }): Promise<Order[]>;
    findById(id: string): Promise<Order>;
    create(dto: CreateOrderDto): Promise<Order>;
    addItem(orderId: string, dto: AddItemDto): Promise<OrderItem>;
    updateItem(itemId: string, dto: UpdateItemDto): Promise<OrderItem>;
    removeItem(itemId: string): Promise<void>;
    changeTable(orderId: string, tableId: string): Promise<Order>;
    splitOrder(orderId: string, dto: SplitOrderDto): Promise<Order>;
    getHistory(orderId: string): Promise<any>;
    private recalculateTotals;
}
//# sourceMappingURL=orders.service.d.ts.map