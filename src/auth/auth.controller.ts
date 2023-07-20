import { Body, Controller, Post, Req, UseGuards, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { IOAuthUser } from './auth.userInterface';
import { SaveFcmDto } from './dto/save-fcm.dto';
import { Response } from 'express';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { OrphanageLoginDto } from './dto/orphanage-login.dto';
import { OrphanageAuthService } from './auth-orphanage.service';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly orphanageAuthService: OrphanageAuthService,
        ){}

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
    @Post('users/refresh')
    async restoreAccessToken(@Req() req: Request & IOAuthUser) {
    return this.authService.restoreAccessToken({user: req.user})
    }

    //로그인
    @Post('orphanages')
    async loginOrphanageUser(@Body() loginUserDto: OrphanageLoginDto, @Res() res: Response) {
        return res.status(200).send(await this.orphanageAuthService.login(loginUserDto, res));
    }
    
    //fcm 저장
    @Post('orphanages/fcm')
    @UseGuards(AuthGuard('access'))
    async saveOrphanageFcmToken(@Body() saveFcmDto: SaveFcmDto){
    return await this.orphanageAuthService.saveFcmToken(saveFcmDto);
    }

    //RT로 새로운 AT 발급 요청
    @UseGuards(AuthGuard('refresh'))
    @Post('orphanages/refresh')
    async restoreOrphanageAccessToken(@Req() req: Request & IOAuthUser) {
    return this.orphanageAuthService.restoreAccessToken({user: req.user})
    }
}
