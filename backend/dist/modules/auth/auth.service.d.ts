import { Repository } from 'typeorm';
import { User } from '../users/users.entity';
import { LoginDto, AuthResponseDto } from './auth.dto';
export declare class AuthService {
    private userRepo;
    private jwtSecret;
    private jwtExpiresIn;
    constructor(userRepo: Repository<User>, jwtSecret: string, jwtExpiresIn?: string);
    login(data: LoginDto): Promise<AuthResponseDto>;
    register(data: {
        email: string;
        password: string;
        name: string;
        role: string;
    }): Promise<User>;
    getProfile(userId: string): Promise<User>;
    updateProfile(userId: string, data: Partial<Pick<User, 'name' | 'email'>>): Promise<User>;
    generateToken(user: User): string;
}
//# sourceMappingURL=auth.service.d.ts.map