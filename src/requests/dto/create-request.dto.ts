import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class CreateRequestDto {
  // @IsString()
  // @ApiProperty({
  //   example: 'aksdghksbdhvjdndvcx',
  //   description: 'The id number of OrphanageUser',
  // })
  // orphanage_user_id: string;

  @IsString()
  @MinLength(2)
  @MaxLength(50)
  @ApiProperty({
    example: '촉촉한 초코칩',
    description: 'The name of ProductName',
  })
  product_name: string;

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
