import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
export interface TokenPayload {
    id: string;
    email: string;
    role: string;
}
declare global {
    namespace Express {
        interface Request {
            user?: TokenPayload;
        }
    }
}
export declare const authenticate: (req: Request, _res: Response, next: NextFunction) => void;
export declare const authorize: (...roles: string[]) => (req: Request, _res: Response, next: NextFunction) => void;
export declare const validate: (schema: ZodSchema, source?: "body" | "query" | "params") => (req: Request, _res: Response, next: NextFunction) => void;
export declare const errorHandler: (err: Error, _req: Request, res: Response, _next: NextFunction) => void;
//# sourceMappingURL=middleware.d.ts.map