import { UserRole } from './users.entity';
export interface CreateUserDto {
    email: string;
    password: string;
    name: string;
    role: UserRole;
}
export interface UpdateUserDto {
    email?: string;
    name?: string;
    role?: UserRole;
    isActive?: boolean;
}
export interface UserResponseDto {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    isActive: boolean;
    createdAt: Date;
}
//# sourceMappingURL=users.dto.d.ts.map