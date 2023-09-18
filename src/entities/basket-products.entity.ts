import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { Request } from "./request.entity";

@Entity('baseket_products')
export class BasketProducts{
    @PrimaryGeneratedColumn()
    basekt_product_id: number;

    @Column()
    count: number;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user_id: User;

    @ManyToMany(() => Request, request => request.basket_products, { onDelete: 'CASCADE' })
    request_id: Request;
}