import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    example: 'email@email.com',
    description: 'The email of User',
  })
  email: string;

  @ApiProperty({
    example: 'abc123!!',
    description: 'The password of User',
  })
  password: string;
}
