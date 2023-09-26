import { Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Review } from "./review.entity";
import { Product } from "./product.entity";
import { OrphanageUser } from "./orphanage-user.entity";

@Entity('review_product')
export class ReviewProduct{
    @PrimaryGeneratedColumn()
    review_product_id: number;

    @ManyToOne(() => Product, {onDelete: 'NO ACTION'})
    @JoinColumn({ name: 'product_id'})
    product_id: Product

    @ManyToOne(() => OrphanageUser, {onDelete: 'CASCADE'})
    @JoinColumn({ name: 'orphanage_user_id' })
    orphanage_user_id: OrphanageUser;

    @ManyToOne(() => Review, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'review_id' })
    review_id?: Review;

}