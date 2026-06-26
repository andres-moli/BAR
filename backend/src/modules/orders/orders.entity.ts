import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, OneToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { TableEntity } from '../tables/tables.entity';
import { User } from '../users/users.entity';
import { Client } from '../clients/clients.entity';
import { OrderItem } from './order-item.entity';
import { SubOrder } from './sub-order.entity';
import { Payment } from '../payments/payments.entity';
import { Invoice } from '../payments/invoice.entity';
import { mapOrderStatus } from '../../shared/entity-mapper';

export enum OrderStatus { OPEN = 'OPEN', IN_PROGRESS = 'IN_PROGRESS', COMPLETED = 'COMPLETED', PAID = 'PAID', CANCELLED = 'CANCELLED' }

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
  @OneToMany(() => SubOrder, so => so.order) subOrders: SubOrder[];
  @OneToMany(() => Payment, p => p.order) payments: Payment[];
  @OneToOne(() => Invoice, i => i.order) invoice: Invoice;
  @CreateDateColumn({ name: 'created_at' }) createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at' }) updatedAt: Date;
  @Column({ type: 'varchar', name: 'version_group_id', nullable: true }) versionGroupId: string;
  @Column({ type: 'int', default: 1 }) version: number;
  @Column({ type: 'timestamp', name: 'closed_at', nullable: true }) closedAt: Date;

  toJSON() {
    const payments = (this.payments || []).filter(p => p != null);
    const totalPaid = payments.reduce((s, p) => s + Number(p.amount), 0);
    const lastPayment = payments[payments.length - 1];
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
      sub_ordenes: this.subOrders,
      total: this.total,
      subtotal: this.subtotal,
      versionGroupId: this.versionGroupId,
      version: this.version,
      pagos: payments.map(p => ({
        id: p.id,
        monto: p.amount,
        paymentMethodId: p.paymentMethodId,
        paymentMethod: p.paymentMethod,
        referencia: p.reference,
        created_at: p.createdAt,
      })),
      totalPagado: totalPaid,
      pendiente: Math.max(0, Number(this.total) - totalPaid),
      propina: 0,
      metodo_pago: lastPayment?.paymentMethod?.name || null,
      nota: this.notes || null,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
    };
  }
}
