import { Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Review } from "./review.entity";
import { Product } from "./product.entity";

@Entity('review_product')
export class ReviewProduct{
    @PrimaryGeneratedColumn()
    review_product_id: number;

    @ManyToOne(() => Review, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'review_id' })
    review_id: Review;

    @ManyToOne(() => Product, {onDelete: 'NO ACTION'})
    @JoinColumn({ name: 'product_id'})
    product_id: Product
}