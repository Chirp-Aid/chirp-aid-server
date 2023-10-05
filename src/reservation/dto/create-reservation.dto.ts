import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, Matches, isString } from 'class-validator';

export class CreateReservationDto {
  @IsNumber()
  @ApiProperty({
    example: 1,
    description: '보육원 ID',
  })
  orphanage_id: number;

  @IsString()
  @Matches(/^(\d{4})-(\d{2})-(\d{2})$/, {
    message:
      '날짜 형식이 올바르지 않습니다. YYYY-MM-DD 형식으로 기입하여 주십시요.',
  })
  @ApiProperty({
    example: '2023-12-25',
    description: '작성 일시, YYYY-MM-DD 형식으로 입력해주세요.',
  })
  visit_date: string;

  @IsString()
  @ApiProperty({
    example: '방문 신청해요~',
    description: '신청 이유',
  })
  reason: string;
}
