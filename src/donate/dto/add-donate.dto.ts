import { ApiProperty } from '@nestjs/swagger';

export class AddBasketDto {
  @ApiProperty({
    example: 1,
    description: '장바구니에 담을 물품 수량',
  })
  count: number;

  @ApiProperty({
    example: 13,
    description: '요청 id',
  })
  request_id: number;
}
