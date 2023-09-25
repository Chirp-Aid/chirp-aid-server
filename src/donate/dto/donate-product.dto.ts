import { ApiProperty } from "@nestjs/swagger";

export class DonateProductDto {
    @ApiProperty({
        example: 1,
        description: '해당 요청 id'
    })
    request_id: number;

    @ApiProperty({
        example: 10,
        description: '기부할 수량'
    })
    count: number;
}