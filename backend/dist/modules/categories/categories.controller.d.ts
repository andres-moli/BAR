import { Request, Response, NextFunction } from 'express';
import { CategoriesService } from './categories.service';
type Handler = (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare class CategoriesController {
    private categoriesService;
    constructor(categoriesService: CategoriesService);
    getAll: Handler;
    getById: Handler;
    create: Handler;
    update: Handler;
    delete: Handler;
}
export {};
//# sourceMappingURL=categories.controller.d.ts.map