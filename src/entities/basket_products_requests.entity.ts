import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Request } from "./request.entity";
import { BasketProduct } from "./basket-products.entity";

@Entity('basket_product_request')
export class BasketProductRequest
{
    // @PrimaryColumn({ name: 'request_id' })
    @PrimaryColumn()
    request_id: number;

    @PrimaryColumn()
    basket_product_id: number;

    @ManyToOne( ()=> Request, request => request.basket_products, { onDelete: 'NO ACTION' } )
    @JoinColumn([{name: 'request_id', referencedColumnName: 'request_id'}])
    requests: Request[];

    @ManyToOne( () => BasketProduct, basketProduct => basketProduct.requests, {onDelete: 'NO ACTION'} )
    @JoinColumn([{name: 'basket_product_id', referencedColumnName: 'basket_product_id'}])
    basket_products: BasketProduct[];
}