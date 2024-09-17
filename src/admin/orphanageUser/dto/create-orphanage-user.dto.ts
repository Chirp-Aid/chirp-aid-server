import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { NotIn } from 'src/commons/not-in';

export class CreateOrphanageUserDto {
  @Transform((params) => params.value.trim())
  @NotIn('password', {
    message: 'password는 name과 같은 문자열을 포함할 수 없습니다. ',
  })
  @IsString()
  @MinLength(2)
  @MaxLength(15)
  @ApiProperty({
    example: '황용진',
    description: '보육원 사용자 이름',
  })
  readonly name: string;

  @IsString()
  @IsEmail()
  @MaxLength(60)
  @ApiProperty({
    example: 'dswvgw1234@gmail.com',
    description: '보육원 사용자 이메일',
  })
  readonly email: string;

  @IsString()
  @Matches(/^[A-Za-z\d!@#$%^&*()]{8,30}$/, {
    message:
      '비밀번호는 8글자 이상으로 ^[A-Za-zd!@#$%^&*()]{8,30}가 포함되어야 합니다.',
  })
  @ApiProperty({
    example: 'abc123!!',
    description: '보육원 사용자 비밀번호',
  })
  readonly password: string;

  @IsString()
  @ApiProperty({
    example: '금오보육원',
    description: '보육원 이름',
  })
  orphanage_name: string;
}
