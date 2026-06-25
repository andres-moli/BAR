import { Request, Response, NextFunction } from 'express';
import { AccountsService } from './accounts.service';
export declare class AccountController {
    private service;
    constructor(service: AccountsService);
    getAll: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    create: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    update: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    delete: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=accounts.controller.d.ts.map