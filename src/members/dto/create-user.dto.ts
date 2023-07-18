import { BadRequestException } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEmail, IsInt, IsString, Matches, MaxLength, MinLength, isString } from "class-validator";
import { NotIn } from "../../not-in";
import { messaging } from "firebase-admin";

export class CreateUserDto {
    @Transform(params => params.value.trim())
    @NotIn('password', {message: 'password는 name과 같은 문자열을 포함할 수 없습니다. '})
    @IsString()
    @MinLength(2)
    @MaxLength(15)
    @ApiProperty({
        example: 'Hong gildong',
        description: 'The name of User'
    })
    readonly name: string;

    @IsString()
    @IsEmail()
    @MaxLength(60)
    @ApiProperty({
        example: 'email@email.com',
        description: 'The eamil of User'
    })
    readonly email: string;

    @IsString()
    @Matches(/^[A-Za-z\d!@#$%^&*()]{8,30}$/, {message: '비밀번호는 8글자 이상으로 ^[A-Za-z\d!@#$%^&*()]{8,30}가 포함되어야 합니다.'})
    @ApiProperty({
        example: 'abc123!!',
        description: 'The password of User'
    })
    readonly password: string;

    @IsInt()
    age: number;

    @IsString()
    @ApiProperty({
        example: 'f',
        description: 'The sex of User'
    })
    sex: string;

    @IsString()
    @MinLength(2)
    @MaxLength(15)
    nickname: string;

    @IsString()
    @MaxLength(15)
    region: string;

    @MaxLength(15)
    phone_number: string;

    @IsString()
    profile_photo: string;
}