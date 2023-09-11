import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { NotIn } from '../../not-in';

export class UpdateOrphanageUserDto {
  @Transform((params) => params.value.trim())
  @NotIn('password', {
    message: 'password는 name과 같은 문자열을 포함할 수 없습니다. ',
  })
  @IsString()
  @MinLength(2)
  @MaxLength(15)
  @ApiProperty({
    example: '홍길동',
    description: 'The name of OrphanageUser',
  })
  readonly name: string;

  @IsString()
  @Matches(/^[A-Za-z\d!@#$%^&*()]{8,30}$/, {
    message:
      '비밀번호는 8글자 이상으로 ^[A-Za-zd!@#$%^&*()]{8,30}가 포함되어야 합니다.',
  })
  @ApiProperty({
    example: 'abc123!!',
    description: 'The password of OrphanageUser',
  })
  readonly password: string;
}
