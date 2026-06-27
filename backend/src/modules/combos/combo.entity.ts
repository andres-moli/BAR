import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Category } from '../categories/categories.entity';
import { ComboProduct } from './combo-product.entity';

@Entity('combos')
export class Combo {
  @PrimaryGeneratedColumn() id: string;
  @Column({ type: 'varchar' }) name: string;
  @Column('decimal', { precision: 10, scale: 2, default: 0 }) price: number;
  @Column({ type: 'varchar', name: 'category_id' }) categoryId: string;
  @ManyToOne(() => Category) @JoinColumn({ name: 'category_id' }) category: Category;
  @Column({ type: 'boolean', default: true }) isActive: boolean;
  @Column({ type: 'varchar', name: 'image_url', nullable: true }) imageUrl: string;
  @OneToMany(() => ComboProduct, cp => cp.combo, { cascade: true, eager: true }) products: ComboProduct[];
  @CreateDateColumn({ name: 'created_at' }) createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at' }) updatedAt: Date;

  toJSON() {
    return {
      id: this.id, nombre: this.name, precio: this.price,
      categoria_id: this.categoryId, category: this.category,
      activo: this.isActive, imagen: this.imageUrl,
      productos: this.products,
      created_at: this.createdAt, updated_at: this.updatedAt,
    };
  }
}
