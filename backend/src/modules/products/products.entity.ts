import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Category } from '../categories/categories.entity';
import { OrderItem } from '../orders/order-item.entity';
import { Movement } from './movement.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  description: string;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  price: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true, default: 0 })
  cost: number;

  @Column({ type: 'varchar', name: 'category_id' })
  categoryId: string;

  @ManyToOne(() => Category, cat => cat.products)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column({ type: 'boolean', name: 'is_active', default: true })
  isActive: boolean;

  @Column({ type: 'int', default: 0 })
  stock: number;

  @Column({ type: 'varchar', name: 'image_url', nullable: true })
  imageUrl: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => OrderItem, oi => oi.product)
  orderItems: OrderItem[];

  @OneToMany(() => Movement, m => m.product)
  movements: Movement[];

  toJSON() {
    return {
      id: this.id,
      nombre: this.name,
      descripcion: this.description,
      precio: this.price,
      costo: this.cost,
      categoria_id: this.categoryId,
      category: this.category,
      activo: this.isActive,
      stock: this.stock,
      imagen: this.imageUrl,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
    };
  }
}
