import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { Request } from "./request.entity";

@Entity('basket_product')
export class BasketProduct{
    @PrimaryGeneratedColumn()
    basket_product_id: number;

    @Column()
    count: number;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user_id: User;

    @ManyToMany(() => Request, request => request.basket_products, { onDelete: 'CASCADE' })
    requests?: Request[];
}