import { Body, Controller, Post, Req, UseGuards, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { IOAuthUser } from './auth.userInterface';
import { SaveFcmDto } from './dto/save-fcm.dto';
import { Response } from 'express';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService){}

    //로그인
    @Post('users')
    async loginUser(@Body() loginUserDto: LoginDto, @Res() res: Response) {
        return res.status(200).send(await this.authService.login(loginUserDto, res));
    }
    
    //fcm 저장
    @Post('users/fcm')
    @UseGuards(AuthGuard('access'))
    async saveFcmToken(@Body() saveFcmDto: SaveFcmDto){
    return await this.authService.saveFcmToken(saveFcmDto);
    }

    //RT로 새로운 AT 발급 요청
    @UseGuards(AuthGuard('refresh'))
    @Post('refresh')
    async restoreAccessToken(@Req() req: Request & IOAuthUser) {
    return this.authService.restoreAccessToken({user: req.user})
    }
}
