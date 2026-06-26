import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Order } from './orders.entity';
import { User } from '../users/users.entity';

export enum SubOrderStatus {
  PENDIENTE = 'PENDIENTE',
  CONFIRMADO = 'CONFIRMADO',
  ENTREGADO = 'ENTREGADO',
  CANCELADO = 'CANCELADO',
}

@Entity('sub_orders')
export class SubOrder {
  @PrimaryGeneratedColumn() id: string;
  @Column({ type: 'varchar', name: 'order_id' }) orderId: string;
  @ManyToOne(() => Order, o => o.subOrders) @JoinColumn({ name: 'order_id' }) order: Order;
  @Column({ type: 'enum', enum: SubOrderStatus, default: SubOrderStatus.PENDIENTE }) status: SubOrderStatus;
  @Column({ type: 'varchar', name: 'created_by' }) createdBy: string;
  @ManyToOne(() => User) @JoinColumn({ name: 'created_by' }) creator: User;
  @Column({ type: 'varchar', name: 'delivered_by', nullable: true }) deliveredBy: string;
  @ManyToOne(() => User) @JoinColumn({ name: 'delivered_by' }) deliverer: User;
  @CreateDateColumn({ name: 'created_at' }) createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at' }) updatedAt: Date;
  @Column({ type: 'timestamp', name: 'delivered_at', nullable: true }) deliveredAt: Date;

  toJSON() {
    return {
      id: this.id,
      pedido_id: this.orderId,
      mesa_numero: this.order?.table?.number || null,
      estado: SubOrderStatus[this.status],
      creado_por: this.creator?.name || this.createdBy,
      creado_por_id: this.createdBy,
      entregado_por: this.deliverer?.name || null,
      created_at: this.createdAt,
      delivered_at: this.deliveredAt,
    };
  }
}
