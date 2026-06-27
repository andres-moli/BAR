import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Combo } from './combo.entity';
import { Product } from '../products/products.entity';

@Entity('combo_products')
export class ComboProduct {
  @PrimaryGeneratedColumn() id: string;
  @Column({ type: 'varchar', name: 'combo_id' }) comboId: string;
  @ManyToOne(() => Combo, c => c.products) @JoinColumn({ name: 'combo_id' }) combo: Combo;
  @Column({ type: 'varchar', name: 'product_id' }) productId: string;
  @ManyToOne(() => Product) @JoinColumn({ name: 'product_id' }) product: Product;
  @Column({ type: 'int', default: 1 }) quantity: number;

  toJSON() {
    return { id: this.id, combo_id: this.comboId, producto_id: this.productId, product: this.product, cantidad: this.quantity };
  }
}
