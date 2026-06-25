import { Request, Response, NextFunction } from 'express';
import { TablesService } from './tables.service';
type Handler = (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare class TablesController {
    private tablesService;
    constructor(tablesService: TablesService);
    getAll: Handler;
    getById: Handler;
    create: Handler;
    update: Handler;
    delete: Handler;
    updateStatus: Handler;
}
export {};
//# sourceMappingURL=tables.controller.d.ts.map