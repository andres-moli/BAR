import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Order } from '../orders/orders.entity';

@Entity('invoices')
export class Invoice {
  @PrimaryGeneratedColumn() id: string;
  @Column({ type: 'varchar', name: 'invoice_number', unique: true }) invoiceNumber: string;
  @Column('decimal', { precision: 10, scale: 2, default: 0 }) subtotal: number;
  @Column('decimal', { precision: 10, scale: 2, default: 0 }) tax: number;
  @Column('decimal', { precision: 10, scale: 2, default: 0 }) total: number;
  @Column('decimal', { precision: 10, scale: 2, default: 0 }) discount: number;
  @Column({ type: 'varchar', nullable: true }) nit: string;
  @Column({ type: 'varchar', nullable: true }) name: string;
  @Column({ type: 'varchar', nullable: true }) email: string;
  @Column({ type: 'varchar', name: 'order_id', unique: true }) orderId: string;
  @OneToOne(() => Order, o => o.invoice) @JoinColumn({ name: 'order_id' }) order: Order;
  @CreateDateColumn({ name: 'created_at' }) createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at' }) updatedAt: Date;

  toJSON() {
    return {
      id: this.id,
      invoiceNumber: this.invoiceNumber,
      subtotal: this.subtotal,
      tax: this.tax,
      total: this.total,
      discount: this.discount,
      nit: this.nit,
      name: this.name,
      email: this.email,
      orderId: this.orderId,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
    };
  }
}
