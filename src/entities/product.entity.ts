import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('product_info')
export class Product {
  @PrimaryGeneratedColumn()
  product_id: number;

  @Column({ length: 50 })
  product_name: string;

  @Column()
  price: number;

  @Column()
  product_photo: string;

  @Column()
  product_link: string;
}
