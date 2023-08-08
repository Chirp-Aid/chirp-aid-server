import { ApiProperty } from '@nestjs/swagger';

export class OrphanageLoginDto {
  @ApiProperty({
    example: 'email@email.com',
    description: 'The email of OrphanageUser',
  })
  email: string;

  @ApiProperty({
    example: 'abc123!!',
    description: 'The password of OrphanageUser',
  })
  password: string;
}
