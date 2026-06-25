import { Repository } from 'typeorm';
import { Payment } from './payments.entity';
import { Invoice } from './invoice.entity';
import { Order } from '../orders/orders.entity';
import { ProcessPaymentDto } from './payments.dto';
export declare class PaymentsService {
    private paymentRepo;
    private invoiceRepo;
    private orderRepo;
    constructor(paymentRepo: Repository<Payment>, invoiceRepo: Repository<Invoice>, orderRepo: Repository<Order>);
    processPayment(dto: ProcessPaymentDto): Promise<{
        payment: Payment;
        invoice?: Invoice;
        orderCompleted: boolean;
    }>;
    getByOrder(orderId: string): Promise<Payment[]>;
    private getTotalPaid;
    private generateInvoice;
}
//# sourceMappingURL=payments.service.d.ts.map