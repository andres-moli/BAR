import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Order } from '../orders/orders.entity';
import { CollectionAccount } from '../collections/collections.entity';

@Entity('clients')
export class Client {
  @PrimaryGeneratedColumn() id: string;
  @Column({ type: 'varchar' }) name: string;
  @Column({ type: 'varchar', nullable: true, unique: true }) email: string;
  @Column({ type: 'varchar', nullable: true }) phone: string;
  @Column({ type: 'varchar', nullable: true }) document: string;
  @Column({ type: 'varchar', nullable: true }) address: string;
  @CreateDateColumn({ name: 'created_at' }) createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at' }) updatedAt: Date;
  @OneToMany(() => Order, o => o.client) orders: Order[];
  @OneToMany(() => CollectionAccount, ca => ca.client) collectionAccounts: CollectionAccount[];

  toJSON() {
    return {
      id: this.id,
      nombre: this.name,
      email: this.email,
      telefono: this.phone,
      documento: this.document,
      direccion: this.address,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
    };
  }
}
