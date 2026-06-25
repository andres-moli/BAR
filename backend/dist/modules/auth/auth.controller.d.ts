import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';
type Handler = (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login: Handler;
    getProfile: Handler;
    updateProfile: Handler;
}
export {};
//# sourceMappingURL=auth.controller.d.ts.map