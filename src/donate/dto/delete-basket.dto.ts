import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";

export class DelBasketDto{
    @IsNumber()
    @ApiProperty({
        example: 1,
        description: '삭제할 장바구니의 id'
    })
    basket_product_id: number;
}