import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { CollectionAccount } from './collections.entity';
import { PaymentMethod } from '../payment-methods/payment-methods.entity';

@Entity('collection_payments')
export class CollectionPayment {
  @PrimaryGeneratedColumn() id: string;
  @Column('decimal', { precision: 10, scale: 2, default: 0 }) amount: number;
  @Column({ type: 'varchar', name: 'payment_method_id' }) paymentMethodId: string;
  @ManyToOne(() => PaymentMethod) @JoinColumn({ name: 'payment_method_id' }) paymentMethod: PaymentMethod;
  @Column({ type: 'varchar', nullable: true }) reference: string;
  @Column({ type: 'varchar', name: 'collection_account_id' }) collectionAccountId: string;
  @ManyToOne(() => CollectionAccount, ca => ca.payments) @JoinColumn({ name: 'collection_account_id' }) collectionAccount: CollectionAccount;
  @CreateDateColumn({ name: 'created_at' }) createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at' }) updatedAt: Date;

  toJSON() {
    return {
      id: this.id,
      cuenta_cobro_id: this.collectionAccountId,
      monto: this.amount,
      paymentMethodId: this.paymentMethodId,
      paymentMethod: this.paymentMethod,
      referencia: this.reference,
      created_at: this.createdAt,
    };
  }
}
