import { Repository } from 'typeorm';
import { Order } from '../orders/orders.entity';
import { Invoice } from '../payments/invoice.entity';
import { CollectionAccount } from '../collections/collections.entity';
export declare class PrintService {
    private orderRepo;
    private invoiceRepo;
    private collectionRepo;
    constructor(orderRepo: Repository<Order>, invoiceRepo: Repository<Invoice>, collectionRepo: Repository<CollectionAccount>);
    private line;
    private separator;
    private center;
    private formatOrderLines;
    printOrder(orderId: string): Promise<string>;
    printPreBill(orderId: string): Promise<string>;
    printInvoice(invoiceId: string): Promise<string>;
    printCollectionAccount(collectionId: string): Promise<string>;
}
//# sourceMappingURL=print.service.d.ts.map