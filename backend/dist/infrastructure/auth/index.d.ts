import { Request } from 'express';
export interface TokenPayload {
    id: string;
    email: string;
    role: string;
}
export interface AuthTokens {
    accessToken: string;
}
export declare class AuthService {
    private readonly jwtSecret;
    private readonly jwtExpiresIn;
    private readonly saltRounds;
    constructor();
    generateToken(payload: TokenPayload): string;
    verifyToken(token: string): TokenPayload;
    hashPassword(password: string): Promise<string>;
    comparePasswords(password: string, hash: string): Promise<boolean>;
    extractTokenFromRequest(req: Request): string | null;
    getCurrentUser(req: Request): TokenPayload | null;
}
export declare const authService: AuthService;
//# sourceMappingURL=index.d.ts.map