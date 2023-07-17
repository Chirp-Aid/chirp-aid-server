import { BadRequestException } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
// // import { Transform } from "class-transformer";
// import { IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator";
// import { NotIn } from "src/not-in";

export class CreateUserDto {
    @Transform(params => params.value.trim())
    @NotIn('password', {message: 'password는 name과 같은 문자열을 포함할 수 없습니다. '})
    @IsString()
    @MinLength(2)
    @MaxLength(30)
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
    @Matches(/^[A-Za-z\d!@#$%^&*()]{8,30}$/)
    @ApiProperty({
        example: 'abc123!!',
        description: 'The passowrd of User'
    })
    readonly password: string;
}