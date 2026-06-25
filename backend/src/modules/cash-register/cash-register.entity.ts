import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from 'typeorm';
import { CashMovement } from './cash-movement.entity';

export enum CashRegisterStatus { OPEN = 'OPEN', CLOSED = 'CLOSED' }

@Entity('cash_registers')
export class CashRegister {
  @PrimaryGeneratedColumn() id: string;
  @CreateDateColumn() date: Date;
  @Column('decimal', { precision: 10, scale: 2, name: 'initial_amount', default: 0 }) initialAmount: number;
  @Column('decimal', { precision: 10, scale: 2, name: 'final_amount', nullable: true }) finalAmount: number;
  @Column({ type: 'enum', enum: CashRegisterStatus, default: CashRegisterStatus.OPEN }) status: CashRegisterStatus;
  @Column({ type: 'varchar', name: 'opened_by' }) openedBy: string;
  @Column({ type: 'varchar', name: 'closed_by', nullable: true }) closedBy: string;
  @Column({ type: 'timestamp', name: 'opened_at', default: () => 'CURRENT_TIMESTAMP' }) openedAt: Date;
  @Column({ type: 'timestamp', name: 'closed_at', nullable: true }) closedAt: Date;
  @Column({ type: 'varchar', nullable: true }) notes: string;
  @OneToMany(() => CashMovement, cm => cm.cashRegister, { cascade: true }) movements: CashMovement[];

  toJSON() {
    return {
      id: this.id,
      date: this.date,
      initialAmount: this.initialAmount,
      finalAmount: this.finalAmount,
      status: this.status,
      openedBy: this.openedBy,
      closedBy: this.closedBy,
      openedAt: this.openedAt,
      closedAt: this.closedAt,
      notes: this.notes,
      movements: this.movements,
    };
  }
}
