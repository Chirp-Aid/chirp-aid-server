import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    example: '황용진',
    description: 'name',
    required: false,
  })
  name?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'dswvgw1234@gmail.com',
    description: 'email',
    required: false,
  })
  email?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'd13891389',
    description: 'password',
    required: false,
  })
  password?: string;

  @IsOptional()
  @IsInt()
  @ApiProperty({
    example: 5,
    description: 'age',
    required: false,
  })
  age?: number;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'm',
    description: 'sex',
    required: false,
  })
  sex?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'oko_jin',
    description: 'nickname',
    required: false,
  })
  nickname?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: '뉴욕',
    description: 'region',
    required: false,
  })
  region?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: '01033288164',
    description: 'phone_number',
    required: false,
  })
  phone_number?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: '사진 url',
    description: 'profile_photo',
    required: false,
  })
  profile_photo?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'admin',
    description: 'role',
    required: false,
  })
  role?: string;
}
