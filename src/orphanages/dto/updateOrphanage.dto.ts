import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber } from 'class-validator';

export class UpdateOrphanageDto {
  @IsNumber()
  @ApiProperty({
    example: '1',
    description: 'The ID of Orphange',
  })
  orphanage_id: number;

  @IsString()
  @ApiProperty({
    example: '보육원1',
    description: 'The Name of Orphanage',
  })
  orphanage_name: string;

  @IsString()
  @ApiProperty({
    example: '경상북도 구미시 대학로 61',
    description: 'The Address of Orphanage',
  })
  address: string;

  @IsString()
  @ApiProperty({
    example: 'www.kumoh.ac.kr',
    description: 'The Homepage Link of Orphanage',
  })
  homepage_link: string;

  @IsString()
  @ApiProperty({
    example: '054)478-7114',
    description: 'The PhoneNumber of Orphanage',
  })
  phone_number: string;

  @IsString()
  @ApiProperty({
    example: '희망찬 보육원~',
    description: 'The Descrption of Orphanage',
  })
  description: string;

  @IsString()
  @ApiProperty({
    example: '보육원 사진',
    description: 'The Photo of Orphanage',
  })
  photo: string;
}
