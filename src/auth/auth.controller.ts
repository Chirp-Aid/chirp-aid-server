import { Body, Controller, Post, Get, Req, UseGuards, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { IOAuthUser } from './auth.userInterface';
import { SaveFcmDto } from './dto/save-fcm.dto';
import { Response } from 'express';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { OrphanageLoginDto } from './dto/orphanage-login.dto';
import { OrphanageAuthService } from './auth-orphanage.service';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from '../entities/user.entity';
import { OrphanageUser } from '../entities/orphanage-user.entity';

@ApiTags('AUTH: Login and SaveFCM')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly orphanageAuthService: OrphanageAuthService,
  ) {}

  //로그인
  @Post('users')
  @ApiOperation({
    summary: '사용자 로그인',
    description: '사용자가 로그인을 시도하면 body에는 AT가, hearders에는 RT가 반환됩니다.',
  })
  @ApiResponse({
    status: 200,
    description: 'JWT 발급 성공',
    type: String,
    headers: {
      'refreshToken' : { description: 'RefreshToken', example: 'flgbkjndvdakjk...' },
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found - 존재하지 않는 이메일입니다.',
  })
  @ApiResponse({
    status: 422,
    description: 'Unprocessable Entity - 비밀번호가 일치하지 않습니다.',
  })
  async loginUser(@Body() loginUserDto: LoginDto, @Res() res: Response) {
    return res
      .status(200)
      .send(await this.authService.login(loginUserDto, res));
  }

  //fcm 저장
  @Post('users/fcm')
  @ApiOperation({
    summary: '사용자 fcm 저장',
    description: '사용자가 로그인 요청을 통해 AT를 발급 받으면, AT를 headers에 넣은 후 FCM Token 저장을 요청합니다.',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer Token (Access Token)',
    example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  })
  @ApiResponse({
    status: 200,
    description: 'FCM Token 저장 성공 및 로그인 성공',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: '홍길동' },
        email: { type: 'string', example: 'email@email.com' },
        age: { type: 'number', example: 23 },
        sex: { type: 'string', example: 'm' },
        nickname: { type: 'string', example: '와이리' },
        region: { type: 'string', example: '서울' },
        phone_number: { type: 'string', example: '01012345678' },
        profile_photo: { type: 'string', example: 'url' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - JWT 토큰 에러',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found - 존재하지 않는 이메일입니다.',
  })
  @UseGuards(AuthGuard('access'))
  async saveFcmToken(@Body() saveFcmDto: SaveFcmDto) {
    return await this.authService.saveFcmToken(saveFcmDto);
  }

  //RT로 새로운 AT 발급 요청
  @Get('users/refresh')
  @ApiOperation({
    summary: '사용자 AT 재발급',
    description: '사용자의 Access Token 재발급을 Refresh Token으로 요청합니다.',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer Token (Refresh Token)',
    example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  })
  @ApiResponse({
    status: 200,
    description: 'AT 재발급 성공',
    type: String
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - JWT 토큰 에러',
  })
  @UseGuards(AuthGuard('refresh'))
  async restoreAccessToken(@Req() req: Request & IOAuthUser) {
    return this.authService.restoreAccessToken({ user: req.user });
  }


  //로그인
  @Post('orphanages')
  @ApiOperation({
    summary: '사용자 로그인',
    description: '사용자가 로그인을 시도하면 body에는 AT가, hearders에는 RT가 반환됩니다.',
  })
  @ApiResponse({
    status: 200,
    description: '로그인 성공',
    type: String,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found - 존재하지 않는 이메일입니다.',
  })
  @ApiResponse({
    status: 422,
    description: 'Unprocessable Entity - 비밀번호가 일치하지 않습니다.',
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
  @ApiOperation({
    summary: '보육원 계정 fcm 저장',
    description: '보육원 계정이 로그인 요청을 통해 AT를 발급 받으면, AT를 headers에 넣은 후 FCM Token 저장을 요청합니다.',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer Token (Access Token)',
    example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  })
  @ApiResponse({
    status: 200,
    description: 'FCM Token 저장 성공 및 로그인 성공',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: '홍길동' },
        email: { type: 'string', example: 'email@email.com' },
        orphanage: {
          type: 'object',
          properties: {
            orphanage_name: { type: 'string', example: 'name1' },
          },
        }
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - JWT 토큰 에러',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found - 존재하지 않는 이메일입니다.',
  })
  @UseGuards(AuthGuard('access'))
  async saveOrphanageFcmToken(@Body() saveFcmDto: SaveFcmDto) {
    return await this.orphanageAuthService.saveFcmToken(saveFcmDto);
  }

  //RT로 새로운 AT 발급 요청
  @Get('orphanages/refresh')
  @ApiOperation({
    summary: '보육원 계정 AT 재발급',
    description: '보육원 계정의 Access Token 재발급을 Refresh Token으로 요청합니다.',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer Token (Refresh Token)',
    example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  })
  @ApiResponse({
    status: 200,
    description: 'AT 재발급 성공',
    type: String
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - JWT 토큰 에러',
  })
  @UseGuards(AuthGuard('refresh'))
  async restoreOrphanageAccessToken(@Req() req: Request & IOAuthUser) {
    return this.orphanageAuthService.restoreAccessToken({ user: req.user });
  }
}
