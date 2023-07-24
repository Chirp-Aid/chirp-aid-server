import { Body, Controller, Post, Req, UseGuards, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { IOAuthUser } from './auth.userInterface';
import { SaveFcmDto } from './dto/save-fcm.dto';
import { Response } from 'express';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { OrphanageLoginDto } from './dto/orphanage-login.dto';
import { OrphanageAuthService } from './auth-orphanage.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from 'src/members/entities/user.entity';
import { OrphanageUser } from 'src/members/entities/orphanage-user.entity.ts';

@ApiTags('AUTH : Login and SaveFCM')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly orphanageAuthService: OrphanageAuthService,
  ) {}

  //로그인
  @Post('users')
  @ApiOperation({ summary: 'Login User' })
  @ApiResponse({
    status: 200,
    description: 'Success Login',
    type: String,
  })
  async loginUser(@Body() loginUserDto: LoginDto, @Res() res: Response) {
    return res
      .status(200)
      .send(await this.authService.login(loginUserDto, res));
  }

  //fcm 저장
  @Post('users/fcm')
  @ApiOperation({ summary: "Save User's FCM Token" })
  @ApiResponse({
    status: 200,
    description: 'Save FCM Token',
    type: User,
  })
  @UseGuards(AuthGuard('access'))
  async saveFcmToken(@Body() saveFcmDto: SaveFcmDto) {
    return await this.authService.saveFcmToken(saveFcmDto);
  }

  //RT로 새로운 AT 발급 요청
  @Post('users/refresh')
  @ApiOperation({ summary: "Refresh Access Token" })
  @ApiResponse({
    status: 200,
    description: 'Refresh Access Token',
    type: String,
  })
  @UseGuards(AuthGuard('refresh'))
  async restoreAccessToken(@Req() req: Request & IOAuthUser) {
    return this.authService.restoreAccessToken({ user: req.user });
  }


  //로그인
  @Post('orphanages')
  @ApiOperation({ summary: 'Login OrphanageUser' })
  @ApiResponse({
    status: 200,
    description: 'Success Login',
    type: String,
  })
  async loginOrphanageUser(
    @Body() loginUserDto: OrphanageLoginDto,
    @Res() res: Response,
  ) {
    return res
      .status(200)
      .send(await this.orphanageAuthService.login(loginUserDto, res));
  }

  //fcm 저장
  @Post('orphanages/fcm')
  @ApiOperation({ summary: "Save OrphanageUser's FCM Token" })
  @ApiResponse({
    status: 200,
    description: 'Save FCM Token',
    type: OrphanageUser,
  })
  @UseGuards(AuthGuard('access'))
  async saveOrphanageFcmToken(@Body() saveFcmDto: SaveFcmDto) {
    return await this.orphanageAuthService.saveFcmToken(saveFcmDto);
  }

  //RT로 새로운 AT 발급 요청
  @Post('orphanages/refresh')
  @ApiOperation({ summary: "Refresh Access Token" })
  @ApiResponse({
    status: 200,
    description: 'Refresh Access Token',
    type: String,
  })
  @UseGuards(AuthGuard('refresh'))
  async restoreOrphanageAccessToken(@Req() req: Request & IOAuthUser) {
    return this.orphanageAuthService.restoreAccessToken({ user: req.user });
  }
}
