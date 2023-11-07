import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateRequestDto {
  @MinLength(2)
  @MaxLength(50)
  @ApiProperty({
    example: '1',
    description: 'The ID of ProductName',
  })
  product_id: number;

  @ApiProperty({
    example: '5',
    description: 'The number of Product',
  })
  count: number;

  @IsString()
  @MaxLength(100)
  @ApiProperty({
    example: '내가 좋아하는 촉촉한 초코칩, 내가 안 좋아는 안 촉촉한 초코칩',
    description: 'The message why they need this product',
  })
  message: string;
}
