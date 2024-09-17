import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @ApiProperty({
    example: '황용진',
    description: 'name',
    required: true,
  })
  name: string;

  @IsString()
  @ApiProperty({
    example: 'dswvgw1234@gmail.com',
    description: 'email',
    required: true,
  })
  email: string;

  @IsString()
  @ApiProperty({
    example: 'd138138',
    description: 'password',
    required: true,
  })
  password: string;

  @IsInt()
  @ApiProperty({
    example: 5,
    description: 'age',
    required: true,
  })
  age: number;

  @IsString()
  @ApiProperty({
    example: 'm',
    description: 'sex',
    required: true,
  })
  sex: string;

  @IsString()
  @ApiProperty({
    example: 'oko_jin',
    description: 'nickname',
    required: true,
  })
  nickname: string;

  @IsString()
  @ApiProperty({
    example: '뉴욕',
    description: 'region',
    required: true,
  })
  region: string;

  @IsString()
  @ApiProperty({
    example: '01033288164',
    description: 'phone_number',
    required: true,
  })
  phone_number: string;

  @IsString()
  @ApiProperty({
    example: '사진 url',
    description: 'profile_photo',
    required: true,
  })
  profile_photo: string;

  @IsString()
  @ApiProperty({
    example: 'user',
    description: 'role',
    required: true,
  })
  role: string;
}
