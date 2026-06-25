import { Request, Response, NextFunction } from 'express';
import { CashRegisterService } from './cash-register.service';
export declare class CashRegisterController {
    private service;
    constructor(service: CashRegisterService);
    open: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    close: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getCurrent: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getMovements: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getSummary: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=cash-register.controller.d.ts.map