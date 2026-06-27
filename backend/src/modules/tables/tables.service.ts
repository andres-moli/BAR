import { Repository } from 'typeorm';
import { TableEntity, TableStatus } from './tables.entity';
import { CreateTableDto, UpdateTableDto, UpdateTableStatusDto } from './tables.dto';
import { NotFoundError, ConflictError } from '../../shared/errors';

export class TablesService {
  constructor(private tableRepo: Repository<TableEntity>) {}

  async findAll(): Promise<TableEntity[]> {
    return this.tableRepo.find({ order: { number: 'ASC' } });
  }

  async findById(id: string): Promise<TableEntity> {
    const table = await this.tableRepo.findOne({ where: { id } });
    if (!table) throw new NotFoundError('Table not found');
    return table;
  }

  async create(data: CreateTableDto): Promise<TableEntity> {
    const table = this.tableRepo.create(data);
    return this.tableRepo.save(table);
  }

  async update(id: string, data: UpdateTableDto): Promise<TableEntity> {
    const table = await this.findById(id);
    Object.assign(table, data);
    return this.tableRepo.save(table);
  }

  async delete(id: string): Promise<void> {
    const table = await this.findById(id);
    await this.tableRepo.remove(table);
  }

  async updateStatus(id: string, status: TableStatus): Promise<TableEntity> {
    const table = await this.findById(id);
    table.status = status;
    return this.tableRepo.save(table);
  }
}
