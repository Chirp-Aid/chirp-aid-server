import { ApiProperty } from "@nestjs/swagger";

export class SaveOrphanageFcmDto {
  @ApiProperty({
    example: 'email@email.com',
    description: 'The email of OrphanageUser',
  })
  email: string;

  @ApiProperty({
    example: ' ',
    description: 'The fcmToken of OrphanageUser',
  })
  fcmToken: string;
}
