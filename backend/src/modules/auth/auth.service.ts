import { Repository } from 'typeorm';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../users/users.entity';
import { LoginDto, AuthResponseDto } from './auth.dto';
import { UnauthorizedError, NotFoundError, ConflictError } from '../../shared/errors';

export class AuthService {
  constructor(
    private userRepo: Repository<User>,
    private jwtSecret: string,
    private jwtExpiresIn: string = '8h',
  ) {}

  async login(data: LoginDto): Promise<AuthResponseDto> {
    let user: User | null = null;

    if (data.code) {
      user = await this.userRepo.findOne({ where: { code: data.code } });
      if (!user) throw new UnauthorizedError('Invalid code');
    } else if (data.email && data.password) {
      user = await this.userRepo.findOne({ where: { email: data.email } });
      if (!user) throw new UnauthorizedError('Invalid email or password');

      const isValid = await bcrypt.compare(data.password, user.password);
      if (!isValid) throw new UnauthorizedError('Invalid email or password');
    } else {
      throw new UnauthorizedError('Invalid credentials');
    }

    if (!user.isActive) throw new UnauthorizedError('Account is disabled');

    const token = this.generateToken(user);
    return {
      token,
      user: user.toJSON(),
    };
  }

  async register(data: { email: string; password: string; name: string; role: string }): Promise<User> {
    const existing = await this.userRepo.findOne({ where: { email: data.email } });
    if (existing) throw new ConflictError('Email already in use');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);

    const userInput = { email: data.email, password: hashedPassword, name: data.name, role: data.role as any };
    const user = this.userRepo.create(userInput);
    return this.userRepo.save(user);
  }

  async getProfile(userId: string): Promise<User> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundError('User not found');
    return user;
  }

  async updateProfile(userId: string, data: Partial<Pick<User, 'name' | 'email'>>): Promise<User> {
    const user = await this.getProfile(userId);

    if (data.email && data.email !== user.email) {
      const existing = await this.userRepo.findOne({ where: { email: data.email } });
      if (existing) throw new ConflictError('Email already in use');
    }

    Object.assign(user, data);
    return this.userRepo.save(user);
  }

  generateToken(user: User): string {
    const payload = { id: user.id, email: user.email, role: user.role };
    return jwt.sign(payload, this.jwtSecret, { expiresIn: this.jwtExpiresIn as any });
  }
}
