import { Repository, LessThan, Like } from 'typeorm';
import { Product } from '../products/products.entity';
import { Movement } from '../products/movement.entity';
import { NotFoundError } from '../../shared/errors';
import { CreateMovementDto, AdjustStockDto, StockFilterDto } from './inventario.dto';

export class InventarioService {
  constructor(
    private productRepo: Repository<Product>,
    private movementRepo: Repository<Movement>,
  ) {}

  async getInventory(filter?: StockFilterDto): Promise<Product[]> {
    const where: any = {};
    if (!filter?.bajoStock) {
      where.isActive = true;
    }
    if (filter?.search) {
      where.name = Like(`%${filter.search}%`);
    }
    const products = await this.productRepo.find({
      where,
      relations: ['category'],
      order: { name: 'ASC' },
    });
    if (filter?.bajoStock) {
      return products.filter((p) => p.stock <= 5);
    }
    return products;
  }

  async getProductStock(productId: string): Promise<Product> {
    const product = await this.productRepo.findOne({
      where: { id: productId },
      relations: ['category'],
    });
    if (!product) throw new NotFoundError('Producto no encontrado');
    return product;
  }

  async getMovements(productId: string): Promise<Movement[]> {
    const product = await this.productRepo.findOne({ where: { id: productId } });
    if (!product) throw new NotFoundError('Producto no encontrado');
    return this.movementRepo.find({
      where: { productId },
      relations: ['user', 'product'],
      order: { createdAt: 'DESC' },
    });
  }

  async createMovement(dto: CreateMovementDto, userId: string): Promise<Movement> {
    const product = await this.productRepo.findOne({ where: { id: dto.productId } });
    if (!product) throw new NotFoundError('Producto no encontrado');

    let newStock = product.stock;
    if (dto.type === 'ENTRY') {
      newStock += dto.quantity;
    } else if (dto.type === 'EXIT') {
      newStock = Math.max(0, newStock - dto.quantity);
    } else if (dto.type === 'ADJUSTMENT') {
      newStock = Math.max(0, dto.quantity);
    }

    await this.productRepo.update(dto.productId, { stock: newStock });

    const movement = this.movementRepo.create({
      productId: dto.productId,
      type: dto.type,
      quantity: dto.quantity,
      description: dto.description || '',
      userId,
    });
    return this.movementRepo.save(movement);
  }

  async adjustStock(productId: string, dto: AdjustStockDto, userId: string): Promise<Product> {
    const product = await this.productRepo.findOne({ where: { id: productId } });
    if (!product) throw new NotFoundError('Producto no encontrado');

    const newStock = Math.max(0, dto.quantity);
    await this.productRepo.update(productId, { stock: newStock });

    const movement = this.movementRepo.create({
      productId,
      type: 'ADJUSTMENT',
      quantity: newStock,
      description: dto.description || 'Ajuste manual de stock',
      userId,
    });
    await this.movementRepo.save(movement);

    return this.productRepo.findOne({ where: { id: productId }, relations: ['category'] }) as Promise<Product>;
  }

  async getLowStockProducts(): Promise<Product[]> {
    return this.productRepo.find({
      where: { isActive: true },
      relations: ['category'],
      order: { stock: 'ASC' },
    }).then((products) => products.filter((p) => p.stock <= 5));
  }
}
