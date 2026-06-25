import { Request, Response, NextFunction } from 'express';
import { PaymentsService } from './payments.service';
export declare class PaymentController {
    private service;
    constructor(service: PaymentsService);
    processPayment: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getByOrder: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getPaymentMethods: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=payments.controller.d.ts.map