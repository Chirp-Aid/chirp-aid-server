import { Inject, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigType } from "@nestjs/config";
import * as jwt from 'jsonwebtoken';
import { refreshToken } from "firebase-admin/app";

interface User{
    user_id: number;
    name: string;
    email: string;
    refresh_token: string;
}


@Injectable()
export class AuthService{
    constructor(
        private readonly jwtService: JwtService,
    ){}

    getAccessToken({user}) {
        return this.jwtService.sign({
            email: user.email,
            sub: user.user_id,
        },
        {
            secret: process.env.JWT_CONFIG,
            expiresIn: '5m',
        },
        );
    }

    setRefreshToken({user, res}) {
        const refreshToken = this.jwtService.sign({
            email: user.email,
            sub: user.user_id,
        },
        {
            secret: process.env.JWT_CONFIG,
            expiresIn: '1d',
        },
        );
        res.setHeader(`Set-Cookie`, `refreshToekn=${refreshToken}`);
        return;
    }

}