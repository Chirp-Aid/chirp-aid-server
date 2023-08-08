import { ApiProperty } from '@nestjs/swagger';

export class SaveFcmDto {
  @ApiProperty({
    example: 'email@email.com',
    description: 'The email of User',
  })
  email: string;

  @ApiProperty({
    example: ' ',
    description: 'The fcmToken of User',
  })
  fcmToken: string;
}
