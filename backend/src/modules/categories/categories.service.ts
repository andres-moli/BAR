import { Repository } from 'typeorm';
import { Category } from './categories.entity';
import { CreateCategoryDto, UpdateCategoryDto } from './categories.dto';
import { NotFoundError, ConflictError } from '../../shared/errors';

export class CategoriesService {
  constructor(private categoryRepo: Repository<Category>) {}

  async findAll(): Promise<Category[]> {
    return this.categoryRepo.find({ order: { name: 'ASC' } });
  }

  async findById(id: string): Promise<Category> {
    const category = await this.categoryRepo.findOne({ where: { id } });
    if (!category) throw new NotFoundError('Category not found');
    return category;
  }

  async create(data: CreateCategoryDto): Promise<Category> {
    const existing = await this.categoryRepo.findOne({ where: { name: data.name } });
    if (existing) throw new ConflictError('Category name already exists');

    const category = this.categoryRepo.create(data);
    return this.categoryRepo.save(category);
  }

  async update(id: string, data: UpdateCategoryDto): Promise<Category> {
    const category = await this.findById(id);

    if (data.name && data.name !== category.name) {
      const existing = await this.categoryRepo.findOne({ where: { name: data.name } });
      if (existing) throw new ConflictError('Category name already exists');
    }

    Object.assign(category, data);
    return this.categoryRepo.save(category);
  }

  async delete(id: string): Promise<void> {
    const category = await this.findById(id);
    await this.categoryRepo.remove(category);
  }
}
