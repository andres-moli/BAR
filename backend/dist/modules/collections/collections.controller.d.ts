import { Request, Response, NextFunction } from 'express';
import { CollectionsService } from './collections.service';
export declare class CollectionController {
    private service;
    constructor(service: CollectionsService);
    getAll: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    create: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    registerPayment: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=collections.controller.d.ts.map