import { Request, Response, NextFunction } from 'express';
import { OrdersService } from './orders.service';
export declare class OrderController {
    private service;
    constructor(service: OrdersService);
    getAll: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    create: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    addItem: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updateItem: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    removeItem: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    changeTable: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    splitOrder: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getHistory: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=orders.controller.d.ts.map