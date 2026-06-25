import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Client } from '../clients/clients.entity';
import { CollectionPayment } from './collection-payment.entity';
import { mapCollectionStatus } from '../../shared/entity-mapper';

export enum CollectionStatus { PENDING = 'PENDING', PARTIALLY_PAID = 'PARTIALLY_PAID', PAID = 'PAID' }

@Entity('collection_accounts')
export class CollectionAccount {
  @PrimaryGeneratedColumn() id: string;
  @Column('decimal', { precision: 10, scale: 2, default: 0 }) totalAmount: number;
  @Column('decimal', { precision: 10, scale: 2, default: 0 }) paidAmount: number;
  @Column({ type: 'enum', enum: CollectionStatus, default: CollectionStatus.PENDING }) status: CollectionStatus;
  @Column({ type: 'varchar', nullable: true }) notes: string;
  @Column({ type: 'varchar', name: 'client_id' }) clientId: string;
  @ManyToOne(() => Client, c => c.collectionAccounts) @JoinColumn({ name: 'client_id' }) client: Client;
  @OneToMany(() => CollectionPayment, cp => cp.collectionAccount, { cascade: true }) payments: CollectionPayment[];
  @CreateDateColumn({ name: 'created_at' }) createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at' }) updatedAt: Date;
  @Column({ type: 'timestamp', name: 'due_date', nullable: true }) dueDate: Date;

  toJSON() {
    return {
      id: this.id,
      cliente_id: this.clientId,
      cliente_nombre: this.client?.name,
      total: this.totalAmount,
      abonado: this.paidAmount,
      pendiente: Math.max(0, this.totalAmount - this.paidAmount),
      estado: mapCollectionStatus(this.status),
      consecutivo: `CC-${String(this.createdAt?.getTime() || '').slice(-6)}`,
      payments: this.payments,
      fecha_emision: this.createdAt,
      fecha_vencimiento: this.dueDate,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
    };
  }
}
