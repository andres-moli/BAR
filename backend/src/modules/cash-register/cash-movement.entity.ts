import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { CashRegister } from './cash-register.entity';
import { Account } from '../accounts/accounts.entity';

@Entity('cash_movements')
export class CashMovement {
  @PrimaryGeneratedColumn() id: string;
  @Column({ type: 'varchar', name: 'cash_register_id' }) cashRegisterId: string;
  @ManyToOne(() => CashRegister, cr => cr.movements) @JoinColumn({ name: 'cash_register_id' }) cashRegister: CashRegister;
  @Column({ type: 'varchar', name: 'account_id' }) accountId: string;
  @ManyToOne(() => Account, a => a.cashMovements) @JoinColumn({ name: 'account_id' }) account: Account;
  @Column('decimal', { precision: 10, scale: 2, default: 0 }) amount: number;
  @Column({ type: 'varchar', default: 'INCOME' }) type: string;
  @Column({ type: 'varchar', nullable: true }) description: string;
  @Column({ type: 'varchar', nullable: true }) reference: string;
  @Column({ type: 'varchar', name: 'payment_id', nullable: true }) paymentId: string;
  @CreateDateColumn({ name: 'created_at' }) createdAt: Date;

  toJSON() {
    return {
      id: this.id,
      cashRegisterId: this.cashRegisterId,
      accountId: this.accountId,
      account: this.account,
      amount: this.amount,
      type: this.type,
      description: this.description,
      reference: this.reference,
      paymentId: this.paymentId,
      createdAt: this.createdAt,
    };
  }
}
