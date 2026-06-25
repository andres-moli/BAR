import { Repository } from 'typeorm';
import bcrypt from 'bcryptjs';
import { User } from './users.entity';
import { CreateUserDto, UpdateUserDto } from './users.dto';
import { NotFoundError, ConflictError } from '../../shared/errors';

export class UsersService {
  constructor(private userRepo: Repository<User>) {}

  async findAll(): Promise<User[]> {
    return this.userRepo.find();
  }

  async findById(id: string): Promise<User> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundError('User not found');
    return user;
  }

  async create(data: CreateUserDto): Promise<User> {
    const existing = await this.userRepo.findOne({ where: { email: data.email } });
    if (existing) throw new ConflictError('Email already in use');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);

    const user = this.userRepo.create({ ...data, password: hashedPassword });
    return this.userRepo.save(user);
  }

  async update(id: string, data: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);

    if (data.email && data.email !== user.email) {
      const existing = await this.userRepo.findOne({ where: { email: data.email } });
      if (existing) throw new ConflictError('Email already in use');
    }

    Object.assign(user, data);
    return this.userRepo.save(user);
  }

  async toggleActive(id: string): Promise<User> {
    const user = await this.findById(id);
    user.isActive = !user.isActive;
    return this.userRepo.save(user);
  }

  async delete(id: string): Promise<void> {
    const user = await this.findById(id);
    await this.userRepo.remove(user);
  }
}
