import { Repository } from 'typeorm';
import { Combo } from './combo.entity';
import { ComboProduct } from './combo-product.entity';
import { NotFoundError } from '../../shared/errors';

export class ComboService {
  constructor(
    private comboRepo: Repository<Combo>,
    private productRepo: Repository<ComboProduct>,
  ) {}

  async getAll(): Promise<Combo[]> {
    return this.comboRepo.find({ order: { name: 'ASC' } });
  }

  async getActive(): Promise<Combo[]> {
    return this.comboRepo.find({ where: { isActive: true }, relations: ['category', 'products', 'products.product'], order: { name: 'ASC' } });
  }

  async getByCategory(categoryId: string): Promise<Combo[]> {
    return this.comboRepo.find({ where: { categoryId, isActive: true }, relations: ['products', 'products.product'] });
  }

  async getById(id: string): Promise<Combo> {
    const combo = await this.comboRepo.findOne({ where: { id }, relations: ['category', 'products', 'products.product'] });
    if (!combo) throw new NotFoundError('Combo not found');
    return combo;
  }

  async create(data: { name: string; price: number; categoryId: string; imageUrl?: string; productIds: { productId: string; quantity: number }[] }): Promise<Combo> {
    const combo = this.comboRepo.create({ name: data.name, price: data.price, categoryId: data.categoryId, imageUrl: data.imageUrl });
    const saved = await this.comboRepo.save(combo);
    if (data.productIds?.length) {
      const products = data.productIds.map(p => this.productRepo.create({ comboId: saved.id, productId: p.productId, quantity: p.quantity }));
      await this.productRepo.save(products);
    }
    return this.getById(saved.id);
  }

  async update(id: string, data: { name?: string; price?: number; categoryId?: string; imageUrl?: string; productIds?: { productId: string; quantity: number }[]; isActive?: boolean }): Promise<Combo> {
    const combo = await this.comboRepo.findOne({ where: { id } });
    if (!combo) throw new NotFoundError('Combo not found');
    if (data.name !== undefined) combo.name = data.name;
    if (data.price !== undefined) combo.price = data.price;
    if (data.categoryId !== undefined) combo.categoryId = data.categoryId;
    if (data.imageUrl !== undefined) combo.imageUrl = data.imageUrl;
    if (data.isActive !== undefined) combo.isActive = data.isActive;
    await this.comboRepo.save(combo);
    if (data.productIds !== undefined) {
      await this.productRepo.delete({ comboId: id });
      if (data.productIds.length) {
        const products = data.productIds.map(p => this.productRepo.create({ comboId: id, productId: p.productId, quantity: p.quantity }));
        await this.productRepo.save(products);
      }
    }
    return this.getById(id);
  }

  async remove(id: string): Promise<void> {
    const combo = await this.comboRepo.findOne({ where: { id } });
    if (!combo) throw new NotFoundError('Combo not found');
    await this.productRepo.delete({ comboId: id });
    await this.comboRepo.remove(combo);
  }
}
