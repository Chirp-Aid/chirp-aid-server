import { ApiProperty } from '@nestjs/swagger';

export class CreateFavoriteDto {
  @ApiProperty({
    example: 2,
    description: 'The id number of Oprhanage',
  })
  orphanage_id: number;
}
