import { ApiProperty } from "@nestjs/swagger";

export class NotificationDto {
  @ApiProperty({
    example: 'nakdfjbskfasvergvsd',
    description: 'The deviceToken of User',
  })
  deviceToken: string;

  @ApiProperty({
    example: '인증글 알림! | 방문 신청 알림!',
    description: 'Notification의 title입니다.',
  })
  title: string;

  @ApiProperty({
    example: '인증글이 작성되었어요. | 방문 신청이 들어왔어요.',
    description: 'Notification의 메시지입니다.',
  })
  body: string;

  @ApiProperty({
    example: '{\
      \n"type": ["POST" | "RESERVATION"]\
      \n"info": ["orphanage_id" | null]\
      \n}',
    description: 'Notification로 전달할 내용입니다.',
  })
  data: {
    type: string,
    info?: string,
  }
}
