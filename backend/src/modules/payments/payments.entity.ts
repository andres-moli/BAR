import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { PaymentMethod } from '../payment-methods/payment-methods.entity';
import { Order } from '../orders/orders.entity';
import { User } from '../users/users.entity';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn() id: string;
  @Column('decimal', { precision: 10, scale: 2, default: 0 }) amount: number;
  @Column({ type: 'varchar', name: 'payment_method_id' }) paymentMethodId: string;
  @ManyToOne(() => PaymentMethod) @JoinColumn({ name: 'payment_method_id' }) paymentMethod: PaymentMethod;
  @Column({ type: 'varchar', nullable: true }) reference: string;
  @Column({ type: 'varchar', name: 'order_id' }) orderId: string;
  @ManyToOne(() => Order, o => o.payments) @JoinColumn({ name: 'order_id' }) order: Order;
  @Column({ type: 'varchar', name: 'user_id' }) userId: string;
  @ManyToOne(() => User) @JoinColumn({ name: 'user_id' }) user: User;
  @CreateDateColumn({ name: 'created_at' }) createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at' }) updatedAt: Date;

  toJSON() {
    return {
      id: this.id,
      pedido_id: this.orderId,
      paymentMethodId: this.paymentMethodId,
      paymentMethod: this.paymentMethod,
      monto: this.amount,
      referencia: this.reference,
      created_at: this.createdAt,
    };
  }
}
