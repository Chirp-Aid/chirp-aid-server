import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsInt,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { NotIn } from '../../commons/not-in';

export class CreateUserDto {
  @Transform((params) => params.value.trim())
  @NotIn('password', {
    message: 'password는 name과 같은 문자열을 포함할 수 없습니다. ',
  })
  @IsString()
  @MinLength(2)
  @MaxLength(15)
  @ApiProperty({
    example: '홍길동',
    description: 'The name of User',
  })
  readonly name: string;

  @IsString()
  @IsEmail()
  @MaxLength(60)
  @ApiProperty({
    example: 'email@email.com',
    description: 'The eamil of User',
  })
  readonly email: string;

  @IsString()
  @Matches(/^[A-Za-z\d!@#$%^&*()]{8,30}$/, {
    message:
      '비밀번호는 8글자 이상으로 ^[A-Za-zd!@#$%^&*()]{8,30}가 포함되어야 합니다.',
  })
  @ApiProperty({
    example: 'abc123!!',
    description: 'The password of User',
  })
  readonly password: string;

  @IsInt()
  @ApiProperty({
    example: 23,
    description: 'The age of User',
  })
  age: number;

  @IsString()
  @ApiProperty({
    example: 'm',
    description: 'The sex of User',
  })
  sex: string;

  @IsString()
  @MinLength(2)
  @MaxLength(15)
  @ApiProperty({
    example: '와이리',
    description: 'The nickName of User',
  })
  nickname: string;

  @IsString()
  @MaxLength(15)
  @ApiProperty({
    example: '서울',
    description: 'The region of User',
  })
  region: string;

  @MaxLength(15)
  @ApiProperty({
    example: '01012345678',
    description: 'The phone number of User',
  })
  phone_number: string;

  @IsString()
  @ApiProperty({
    example: 'url',
    description: 'The profile photo of User',
  })
  profile_photo: string;

  role?: string;
}
