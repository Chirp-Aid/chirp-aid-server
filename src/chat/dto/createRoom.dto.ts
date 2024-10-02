import { ApiProperty } from '@nestjs/swagger';

export class CreateRoomDto {
  @ApiProperty({
    example: 'eweqfervtr',
    description: '일반 사용자',
  })
  user_id: string;

  @ApiProperty({
    example: 'ewfewqghre',
    description: '보육원 사용자',
  })
  orphanage_user_id: string;
}
