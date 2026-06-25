import { Request, Response, NextFunction } from 'express';
import { UsersService } from './users.service';
type Handler = (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    getAll: Handler;
    getById: Handler;
    create: Handler;
    update: Handler;
    delete: Handler;
}
export {};
//# sourceMappingURL=users.controller.d.ts.map