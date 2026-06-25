import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { PaymentMethod } from '../payment-methods/payment-methods.entity';
import { CashMovement } from '../cash-register/cash-movement.entity';

export enum AccountType { CASH = 'CASH', BANK = 'BANK', DIGITAL_WALLET = 'DIGITAL_WALLET', OTHER = 'OTHER' }

@Entity('accounts')
export class Account {
  @PrimaryGeneratedColumn() id: string;
  @Column({ type: 'varchar', unique: true }) name: string;
  @Column({ type: 'enum', enum: AccountType, default: AccountType.CASH }) type: AccountType;
  @Column({ type: 'boolean', name: 'is_active', default: true }) isActive: boolean;
  @CreateDateColumn({ name: 'created_at' }) createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at' }) updatedAt: Date;
  @OneToMany(() => PaymentMethod, pm => pm.account) paymentMethods: PaymentMethod[];
  @OneToMany(() => CashMovement, cm => cm.account) cashMovements: CashMovement[];

  toJSON() {
    return {
      id: this.id,
      nombre: this.name,
      tipo: this.type,
      activo: this.isActive,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
    };
  }
}
