import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Response } from 'express';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_REFRESH_TOKEN
        });
    }

    async validate(payload) {
        // const now = Date.now() / 1000;
        // if (payload.exp < now) {
        //     throw new UnauthorizedException('토큰이 만료되었습니다.');
        // }
        return {
            email: payload.email,
            user_id: payload.sub,
        };
    }

    catch(error: Error, _: unknown, res: Response) {
        let message = 'ERROR';
        if (error.name === 'TokenExpiredError') {
            message = '토큰이 만료되었습니다.';
            res.status(419).json({ code: 419, message });
        }
        else if (error.name === 'JsonWebTokenError') {
            message = '유효하지 않은 토큰입니다.';
            res.status(401).json({ code: 401, message });
        }
        else {
            message = '서버 오류'
            res.status(500).json({ code: 500, message });
        }
    }
}