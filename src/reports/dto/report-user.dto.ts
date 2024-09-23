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

  @IsString()
  @ApiProperty({
    example: '신고자 유저 ID',
    description: 'Reporter User ID',
    required: true,
  })
  reporter_id: string;

  @IsString()
  @ApiProperty({
    example: '아자핑',
    description: 'Reporter User Name',
    required: true,
  })
  reporter_name: string;

  @IsString()
  @ApiProperty({
    example: 'USER',
    description: 'Reporter User Type: USER or ORPHANAGE_USER',
    required: true,
  })
  reporter_type: string;

  @ApiProperty({
    example: '피신고자 유저 ID',
    description: 'Target User ID',
    required: true,
  })
  target_id?: string;

  @ApiProperty({
    example: '앙대핑',
    description: 'Target User ID',
    required: true,
  })
  target_name?: string;

  @ApiProperty({
    example: 'ORPHANAGE_USER',
    description: 'Target User Type: USER or ORPHANAGE_USER',
    required: true,
  })
  target_type?: string;

  @ApiProperty({
    example: null,
    description: 'Board ID',
    required: true,
  })
  board_id?: string;

  @ApiProperty({
    example: null,
    description: 'Board Name',
    required: true,
  })
  board_title?: string;

  @ApiProperty({
    example: null,
    description: 'Board Type: REQUEST or REVIEW',
    required: true,
  })
  board_type?: string;
}
