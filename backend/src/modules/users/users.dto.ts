import { UserRole } from './users.entity';

export interface CreateUserDto {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  code?: string;
}

export interface UpdateUserDto {
  email?: string;
  name?: string;
  role?: UserRole;
  isActive?: boolean;
  code?: string;
}

export interface UserResponseDto {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
}
