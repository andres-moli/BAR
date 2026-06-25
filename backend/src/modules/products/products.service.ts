import { Repository } from 'typeorm';
import { Product } from './products.entity';
import { NotFoundError } from '../../shared/errors';
import { CreateProductDto, UpdateProductDto } from './products.dto';

export class ProductsService {
  constructor(private repo: Repository<Product>) {}

  async findAll(includeInactive = false): Promise<Product[]> {
    const where = includeInactive ? {} : { isActive: true };
    return this.repo.find({ where, relations: ['category'], order: { name: 'ASC' } });
  }

  async findById(id: string): Promise<Product> {
    const product = await this.repo.findOne({ where: { id }, relations: ['category'] });
    if (!product) throw new NotFoundError('Product not found');
    return product;
  }

  async create(dto: CreateProductDto): Promise<Product> {
    const product = this.repo.create(dto);
    return this.repo.save(product);
  }

  async update(id: string, dto: UpdateProductDto): Promise<Product> {
    const product = await this.findById(id);
    Object.assign(product, dto);
    return this.repo.save(product);
  }

  async delete(id: string): Promise<void> {
    const product = await this.findById(id);
    await this.repo.remove(product);
  }

  async toggleActive(id: string): Promise<Product> {
    const product = await this.findById(id);
    product.isActive = !product.isActive;
    return this.repo.save(product);
  }

  async findByCategory(categoryId: string): Promise<Product[]> {
    return this.repo.find({
      where: { categoryId, isActive: true },
      relations: ['category'],
      order: { name: 'ASC' },
    });
  }
}
