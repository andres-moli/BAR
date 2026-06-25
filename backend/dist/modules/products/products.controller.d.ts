import { Request, Response, NextFunction } from 'express';
import { ProductsService } from './products.service';
export declare class ProductController {
    private service;
    constructor(service: ProductsService);
    getAll: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    create: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    update: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    delete: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getByCategory: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=products.controller.d.ts.map