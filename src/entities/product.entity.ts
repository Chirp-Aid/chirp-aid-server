import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('product_info')
export class Product {
    @PrimaryGeneratedColumn()
    product_id: number;

    @Column({ length: 50})
    product_name: string;

    @Column({ length: 150 })
    price: number;
}
