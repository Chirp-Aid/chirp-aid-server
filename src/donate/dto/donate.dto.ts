import { ApiProperty } from "@nestjs/swagger"
import { DonateProductDto } from "./donate-product.dto";

export class DonateDto{
    @ApiProperty({
        example: '[{ "request_id": 1, "count": 40},..]',
        description: '기부할 물품 정보'
    })
    Donates: DonateProductDto[];

    @ApiProperty({
        example: '맛있게 먹으렴~',
        description: '전달할 메시지'
    })
    message: string;
}