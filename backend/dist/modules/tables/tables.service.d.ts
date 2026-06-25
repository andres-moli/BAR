import { Repository } from 'typeorm';
import { TableEntity, TableStatus } from './tables.entity';
import { CreateTableDto, UpdateTableDto } from './tables.dto';
export declare class TablesService {
    private tableRepo;
    constructor(tableRepo: Repository<TableEntity>);
    findAll(): Promise<TableEntity[]>;
    findById(id: string): Promise<TableEntity>;
    create(data: CreateTableDto): Promise<TableEntity>;
    update(id: string, data: UpdateTableDto): Promise<TableEntity>;
    delete(id: string): Promise<void>;
    updateStatus(id: string, status: TableStatus): Promise<TableEntity>;
}
//# sourceMappingURL=tables.service.d.ts.map