import { Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Request } from "./request.entity";
import { User } from "./user.entity";

@Entity('basket_product')
export class BasketProduct
{
    @PrimaryGeneratedColumn()
    basket_product_id: number;

    @PrimaryColumn()
    count: number;

    @ManyToOne( ()=> Request,{ onDelete: 'NO ACTION' } )
    @JoinColumn([{name: 'request_id', referencedColumnName: 'request_id'}])
    request_id: Request;

    @ManyToOne( () => User, {onDelete: 'NO ACTION'} )
    @JoinColumn([{name: 'user_id', referencedColumnName: 'user_id'}])
    user_id: User;
}