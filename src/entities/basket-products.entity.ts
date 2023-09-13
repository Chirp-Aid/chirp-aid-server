import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { Request } from "./request.entity";

@Entity('baseket_products')
export class BasketProducts{
    @PrimaryGeneratedColumn()
    basekt_product_id: number;

    @Column()
    count: number;

    @ManyToOne(() => User, {onDelete: 'CASCADE'})
    @JoinColumn({ name: 'user_id '})
    user_id: User;

    @ManyToMany(()=> Request, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'request_id'})
    request_id: Request;
}