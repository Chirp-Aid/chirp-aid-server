import { ApiProperty } from '@nestjs/swagger';

export class DonateDto {
  @ApiProperty({
    example: [1],
    description: '기부할 장바구니 id',
  })
  basket_product_id: number[];

  @ApiProperty({
    example: '맛있게 먹으렴~',
    description: '전달할 메시지',
  })
  message: string;
}
