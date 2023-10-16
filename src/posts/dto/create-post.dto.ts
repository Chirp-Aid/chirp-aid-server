import { ApiProperty } from '@nestjs/swagger';
import { Product } from 'src/entities/product.entity';

export class CreatePostDto {
  @ApiProperty({
    example: '감사합니다!',
    description: '글 제목',
  })
  title: string;

  @ApiProperty({
    example: '잘 먹겠습니다~!',
    description: '글 내용',
  })
  content: string;

  @ApiProperty({
    description: '사진 url',
  })
  photo: string;

  @ApiProperty({
    example: [{ product_name: '물품명1' }, { product_name: '물품명2' }],
    description: '태그로부터 받은 물품명 목록',
  })
  products: Product[];
}
