import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, OneToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { TableEntity } from '../tables/tables.entity';
import { User } from '../users/users.entity';
import { Client } from '../clients/clients.entity';
import { OrderItem } from './order-item.entity';
import { Payment } from '../payments/payments.entity';
import { Invoice } from '../payments/invoice.entity';
import { mapOrderStatus } from '../../shared/entity-mapper';

export enum OrderStatus { OPEN = 'OPEN', IN_PROGRESS = 'IN_PROGRESS', COMPLETED = 'COMPLETED', CANCELLED = 'CANCELLED' }

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn() id: string;
  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.OPEN }) status: OrderStatus;
  @Column({ type: 'varchar', nullable: true }) notes: string;
  @Column('decimal', { precision: 10, scale: 2, default: 0 }) subtotal: number;
  @Column('decimal', { precision: 10, scale: 2, default: 0 }) tax: number;
  @Column('decimal', { precision: 10, scale: 2, default: 0 }) total: number;
  @Column('decimal', { precision: 10, scale: 2, default: 0 }) discount: number;
  @Column({ type: 'varchar', name: 'table_id', nullable: true }) tableId: string;
  @ManyToOne(() => TableEntity) @JoinColumn({ name: 'table_id' }) table: TableEntity;
  @Column({ type: 'varchar', name: 'user_id' }) userId: string;
  @ManyToOne(() => User) @JoinColumn({ name: 'user_id' }) user: User;
  @Column({ type: 'varchar', name: 'client_id', nullable: true }) clientId: string;
  @ManyToOne(() => Client) @JoinColumn({ name: 'client_id' }) client: Client;
  @OneToMany(() => OrderItem, oi => oi.order, { cascade: true }) items: OrderItem[];
  @OneToMany(() => Payment, p => p.order) payments: Payment[];
  @OneToOne(() => Invoice, i => i.order) invoice: Invoice;
  @CreateDateColumn({ name: 'created_at' }) createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at' }) updatedAt: Date;
  @Column({ type: 'timestamp', name: 'closed_at', nullable: true }) closedAt: Date;

  toJSON() {
    return {
      id: this.id,
      mesa_id: this.tableId,
      mesa_numero: this.table?.number,
      usuario_id: this.userId,
      usuario_nombre: this.user?.name,
      cliente_id: this.clientId,
      cliente_nombre: this.client?.name,
      estado: mapOrderStatus(this.status),
      items: this.items,
      total: this.total,
      subtotal: this.subtotal,
      propina: 0,
      metodo_pago: null,
      nota: this.notes || null,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
    };
  }
}
