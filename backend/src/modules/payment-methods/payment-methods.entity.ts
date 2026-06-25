import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Account } from '../accounts/accounts.entity';
import { Payment } from '../payments/payments.entity';
import { CollectionPayment } from '../collections/collection-payment.entity';

@Entity('payment_methods')
export class PaymentMethod {
  @PrimaryGeneratedColumn() id: string;
  @Column({ type: 'varchar', unique: true }) name: string;
  @Column({ type: 'varchar', name: 'account_id' }) accountId: string;
  @ManyToOne(() => Account, a => a.paymentMethods) @JoinColumn({ name: 'account_id' }) account: Account;
  @Column({ type: 'boolean', name: 'is_active', default: true }) isActive: boolean;
  @CreateDateColumn({ name: 'created_at' }) createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at' }) updatedAt: Date;
  @OneToMany(() => Payment, p => p.paymentMethod) payments: Payment[];
  @OneToMany(() => CollectionPayment, cp => cp.paymentMethod) collectionPayments: CollectionPayment[];

  toJSON() {
    return {
      id: this.id,
      nombre: this.name,
      accountId: this.accountId,
      account: this.account,
      activo: this.isActive,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
    };
  }
}
