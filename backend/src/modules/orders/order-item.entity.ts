import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Order } from './orders.entity';
import { Product } from '../products/products.entity';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn() id: string;
  @Column({ type: 'int', default: 1 }) quantity: number;
  @Column('decimal', { precision: 10, scale: 2, name: 'unit_price' }) unitPrice: number;
  @Column('decimal', { precision: 10, scale: 2, default: 0 }) subtotal: number;
  @Column({ type: 'varchar', nullable: true }) notes: string;
  @Column({ type: 'varchar', name: 'order_id' }) orderId: string;
  @ManyToOne(() => Order, o => o.items) @JoinColumn({ name: 'order_id' }) order: Order;
  @Column({ type: 'varchar', name: 'product_id' }) productId: string;
  @ManyToOne(() => Product) @JoinColumn({ name: 'product_id' }) product: Product;
  @CreateDateColumn({ name: 'created_at' }) createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at' }) updatedAt: Date;

  toJSON() {
    return {
      id: this.id,
      pedido_id: this.orderId,
      producto_id: this.productId,
      producto_nombre: this.product?.name,
      cantidad: this.quantity,
      precio_unitario: this.unitPrice,
      subtotal: this.subtotal,
      notas: this.notes,
      created_at: this.createdAt,
    };
  }
}
