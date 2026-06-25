import { Request, Response, NextFunction } from 'express';
import { PaymentMethodsService } from './payment-methods.service';
export declare class PaymentMethodController {
    private service;
    constructor(service: PaymentMethodsService);
    getAll: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getByAccount: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    create: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    update: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    delete: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=payment-methods.controller.d.ts.map