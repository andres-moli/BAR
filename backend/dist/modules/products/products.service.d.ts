import { Repository } from 'typeorm';
import { Product } from './products.entity';
import { CreateProductDto, UpdateProductDto } from './products.dto';
export declare class ProductsService {
    private repo;
    constructor(repo: Repository<Product>);
    findAll(includeInactive?: boolean): Promise<Product[]>;
    findById(id: string): Promise<Product>;
    create(dto: CreateProductDto): Promise<Product>;
    update(id: string, dto: UpdateProductDto): Promise<Product>;
    delete(id: string): Promise<void>;
    findByCategory(categoryId: string): Promise<Product[]>;
}
//# sourceMappingURL=products.service.d.ts.map