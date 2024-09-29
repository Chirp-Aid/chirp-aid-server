import { ApiProperty } from '@nestjs/swagger';

export class SendMessageDto {
  @ApiProperty({
    example: '차캐핑',
    description: '메시지 보내는 사람',
    required: true,
  })
  sender: string;

  @ApiProperty({
    example: 'USER',
    description: '메시지 보내는 사람 타입',
    required: true,
  })
  type: 'USER' | 'ORPHANAGE_USER';

  @ApiProperty({
    example: 'room123',
    description: '대화방 ID',
    required: true,
  })
  join_room: string;

  @ApiProperty({
    example: '안녕하세요',
    description: '메시지 내용',
    required: true,
  })
  content: string;
}
