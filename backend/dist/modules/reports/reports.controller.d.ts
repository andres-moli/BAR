import { Request, Response, NextFunction } from 'express';
import { ReportsService } from './reports.service';
export declare class ReportController {
    private service;
    constructor(service: ReportsService);
    salesByDayHandler: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    salesByMonthHandler: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    salesByProductHandler: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    salesByCategoryHandler: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    salesByUserHandler: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    topProductsHandler: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    paymentMethodsHandler: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    collectionsHandler: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    clientsWithDebtHandler: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=reports.controller.d.ts.map