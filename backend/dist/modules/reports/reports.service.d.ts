import { Repository } from 'typeorm';
import { Order } from '../orders/orders.entity';
import { Payment } from '../payments/payments.entity';
export declare class ReportsService {
    private orderRepo;
    private paymentRepo;
    constructor(orderRepo: Repository<Order>, paymentRepo: Repository<Payment>);
    salesByDay(startDate?: Date, endDate?: Date): Promise<any[]>;
    salesByMonth(year?: number, month?: number): Promise<any[]>;
    salesByProduct(startDate?: Date, endDate?: Date): Promise<any[]>;
    salesByCategory(startDate?: Date, endDate?: Date): Promise<any[]>;
    salesByUser(startDate?: Date, endDate?: Date): Promise<any[]>;
    topProducts(limit?: number, startDate?: Date, endDate?: Date): Promise<any[]>;
    paymentMethodsReport(startDate?: Date, endDate?: Date): Promise<any[]>;
    collectionsReport(): Promise<any[]>;
    clientsWithDebt(): Promise<any[]>;
}
//# sourceMappingURL=reports.service.d.ts.map