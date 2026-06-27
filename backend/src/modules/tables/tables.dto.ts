import { TableStatus } from './tables.entity';

export interface CreateTableDto {
  number: number;
  name?: string;
  capacity?: number;
  location?: string;
}

export interface UpdateTableDto {
  number?: number;
  name?: string;
  capacity?: number;
  location?: string;
}

export interface UpdateTableStatusDto {
  status: TableStatus;
}

export interface TableResponseDto {
  id: string;
  number: number;
  status: TableStatus;
  capacity: number;
  location: string | null;
  createdAt: Date;
  updatedAt: Date;
}
