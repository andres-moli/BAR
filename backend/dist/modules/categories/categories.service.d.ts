import { Repository } from 'typeorm';
import { Category } from './categories.entity';
import { CreateCategoryDto, UpdateCategoryDto } from './categories.dto';
export declare class CategoriesService {
    private categoryRepo;
    constructor(categoryRepo: Repository<Category>);
    findAll(): Promise<Category[]>;
    findById(id: string): Promise<Category>;
    create(data: CreateCategoryDto): Promise<Category>;
    update(id: string, data: UpdateCategoryDto): Promise<Category>;
    delete(id: string): Promise<void>;
}
//# sourceMappingURL=categories.service.d.ts.map