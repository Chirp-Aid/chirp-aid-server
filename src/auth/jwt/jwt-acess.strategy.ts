import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, 'access') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // 헤더로부터 토큰 추출하는 함수
      secretOrKey: process.env.JWT_ACCESS_TOKEN,
    });
  }

  validate(payload) {
    console.log(payload);
    return {
      email: payload.email,
      user_id: payload.sub,
      role:payload.role
    };
  }
}
