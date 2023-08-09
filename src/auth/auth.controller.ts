import {
  Body,
  Controller,
  Post,
  Get,
  Req,
  UseGuards,
  Res,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { IOAuthUser } from './auth.userInterface';
import { Response } from 'express';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { OrphanageLoginDto } from './dto/orphanage-login.dto';
import { OrphanageAuthService } from './auth-orphanage.service';
import {
  ApiHeader,
  ApiHeaders,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

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
    description: '사용자가 로그인을 시도하면 hearders에 AT와 RT가 반환됩니다.',
  })
  @ApiResponse({
    status: 200,
    description: 'JWT 발급 성공',
    type: String,
    headers: {
      accessToken: {
        description: "'access-token'으로 들어갑니다.",
        example: 'flgbkjndvdakjk...',
      },
      refreshToken: {
        description: "'refresh-token'으로 들어갑니다.",
        example: 'flgbkjndvdakjk...',
      },
    },
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

  @Get('users/fcm')
  @ApiOperation({
    summary: '사용자 fcm 저장',
    description:
      '사용자가 로그인 요청을 통해 AT를 발급 받으면, AT와 FCM Token을 헤더로 요청하여 FCM Token 저장을 요청합니다.',
  })
  @ApiHeaders([
    {
      name: 'Authorization',
      description: 'Bearer {Access Token}',
      example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
    },
    {
      name: 'fcm-token',
      description: 'FCM Token',
      example: 'dsgfabndRdgbfdsvaghfb9',
    },
  ])
  @ApiResponse({
    status: 200,
    description: 'FCM Token 저장 성공 및 로그인 성공',
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
  async saveFcmToken(@Req() req: Request & IOAuthUser) {
    return await this.authService.saveFcmToken(req);
  }

  //RT로 새로운 AT 발급 요청
  @Get('users/refresh')
  @ApiOperation({
    summary: '사용자 AT 재발급',
    description: '사용자의 Access Token 재발급을 Refresh Token으로 요청합니다.',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer {Refresh Token}',
    example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  })
  @ApiResponse({
    status: 200,
    description: 'AT 재발급 성공',
    type: String,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - JWT 토큰 에러',
  })
  @UseGuards(AuthGuard('refresh'))
  async refreshAccessToken(
    @Req() req: Request & IOAuthUser,
    @Res() res: Response,
  ) {
    return res
      .status(200)
      .send(await this.authService.refreshAccessToken({ user: req.user, res }));
  }

  //#############################################
  //로그인
  @Post('orphanages')
  @ApiOperation({
    summary: '보육원 계정 로그인',
    description:
      '보육원 계정이 로그인을 시도하면 hearders에 AT와 RT가 반환됩니다.',
  })
  @ApiResponse({
    status: 200,
    description: 'JWT 발급 성공',
    type: String,
    headers: {
      accessToken: {
        description: "'access-token'으로 들어갑니다.",
        example: 'flgbkjndvdakjk...',
      },
      refreshToken: {
        description: "'refresh-token'으로 들어갑니다.",
        example: 'flgbkjndvdakjk...',
      },
    },
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

  @Get('orphanages/fcm')
  @ApiOperation({
    summary: '보육원 계정 fcm 저장',
    description:
      '보육원 계정이 로그인 요청을 통해 AT를 발급 받으면, AT를 headers에 넣은 후 FCM Token 저장을 요청합니다.',
  })
  @ApiHeaders([
    {
      name: 'Authorization',
      description: 'Bearer {Access Token}',
      example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
    },
    {
      name: 'fcm-token',
      description: 'FCM Token',
      example: 'dsgfabndRdgbfdsvaghfb9',
    },
  ])
  @ApiResponse({
    status: 200,
    description: 'FCM Token 저장 성공 및 로그인 성공',
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
  async saveOrphanageFcmToken(@Req() req: Request & IOAuthUser) {
    return await this.orphanageAuthService.saveFcmToken(req);
  }

  //RT로 새로운 AT 발급 요청
  @Get('orphanages/refresh')
  @ApiOperation({
    summary: '보육원 계정 AT 재발급',
    description:
      '보육원 계정의 Access Token 재발급을 Refresh Token으로 요청합니다.',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer {Refresh Token}',
    example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  })
  @ApiResponse({
    status: 200,
    description: 'AT 재발급 성공',
    type: String,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - JWT 토큰 에러',
  })
  @UseGuards(AuthGuard('refresh'))
  async restoreOrphanageAccessToken(
    @Req() req: Request & IOAuthUser,
    @Res() res: Response,
  ) {
    return res
      .status(200)
      .send(
        await this.orphanageAuthService.restoreAccessToken({
          user: req.user,
          res,
        }),
      );
  }
}
