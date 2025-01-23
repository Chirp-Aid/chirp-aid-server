import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class ReportUserDto {
  @MinLength(2)
  @IsString()
  @ApiProperty({
    example: '이 유저가 너무 불쾌하게 행동했어요',
    description: 'This user is bad',
    required: true,
  })
  description: string;

  @ApiProperty({
    example: '피신고자 유저 ID',
    description: 'Target User ID',
    required: true,
  })
  target_id: string;

  @ApiProperty({
    example: '칩에이드',
    description: 'Target User ID',
    required: true,
  })
  target_name: string;

  @ApiProperty({
    example: 'ORPHANAGE_USER',
    description: 'Target User Type: USER or ORPHANAGE_USER',
    required: true,
  })
  target_type: string;

  @ApiProperty({
    example: 'CHAT',
    description: '글 유형: ORPHANAGE | THANKS | CHAT | RESERVATION',
    required: true,
  })
  board_type: string;

  @ApiProperty({
    example: '성윤아 논문 다시써야 돼',
    description: '신고 글 내용',
    required: true,
  })
  board_content: string;
}
