import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateReservationDto {
  @IsNumber()
  @ApiProperty({
    description: '보육원 ID',
  })
  orphanage_id: number;

  @IsString()
  @ApiProperty({
    example: 'YYYY-MM_DD',
    description: '작성 일시',
  })
  visit_date: string;

  @ApiProperty({
    description: '신청 이유',
  })
  reason: string;
}
