import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Order } from '../orders/orders.entity';
import { mapTableStatus } from '../../shared/entity-mapper';

export enum TableStatus {
  AVAILABLE = 'AVAILABLE',
  OCCUPIED = 'OCCUPIED',
  RESERVED = 'RESERVED',
}

@Entity('tables')
export class TableEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: 'int', unique: true })
  number: number;

  @Column({ type: 'enum', enum: TableStatus, default: TableStatus.AVAILABLE })
  status: TableStatus;

  @Column({ type: 'int', default: 4 })
  capacity: number;

  @Column({ type: 'varchar', nullable: true })
  location: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Order, (order) => order.table)
  orders: Order[];

  toJSON() {
    return {
      id: this.id,
      numero: this.number,
      capacidad: this.capacity,
      estado: mapTableStatus(this.status),
      ubicacion: this.location,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
    };
  }
}
