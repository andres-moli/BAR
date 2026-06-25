import { Request, Response, NextFunction } from 'express';
import { PrintService } from './print.service';
export declare class PrintController {
    private service;
    constructor(service: PrintService);
    printOrderHandler: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    printPreBillHandler: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    printInvoiceHandler: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    printCollectionHandler: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=print.controller.d.ts.map