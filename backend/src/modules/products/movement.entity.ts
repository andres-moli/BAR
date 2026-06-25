import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Product } from './products.entity';
import { User } from '../users/users.entity';

@Entity('movements')
export class Movement {
  @PrimaryGeneratedColumn() id: string;
  @Column({ type: 'varchar' }) type: string;
  @Column({ type: 'int' }) quantity: number;
  @Column({ type: 'varchar', nullable: true }) description: string;
  @Column({ type: 'varchar', name: 'product_id' }) productId: string;
  @ManyToOne(() => Product) @JoinColumn({ name: 'product_id' }) product: Product;
  @Column({ type: 'varchar', name: 'user_id' }) userId: string;
  @ManyToOne(() => User) @JoinColumn({ name: 'user_id' }) user: User;
  @CreateDateColumn({ name: 'created_at' }) createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at' }) updatedAt: Date;

  toJSON() {
    return {
      id: this.id,
      tipo: this.type,
      cantidad: this.quantity,
      descripcion: this.description,
      producto_id: this.productId,
      product: this.product,
      usuario_id: this.userId,
      user: this.user,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
    };
  }
}
