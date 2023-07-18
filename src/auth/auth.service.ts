import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

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
            secret: process.env.JWT_ACCESS_TOKEN,
            expiresIn: '1d',
        },
        );
    }

    setRefreshToken({user, res}) {
        const refreshToken = this.jwtService.sign({
            email: user.email,
            sub: user.user_id,
        },
        {
            secret: process.env.JWT_REFRESH_TOKEN,
            expiresIn: '2w',
        },
        );
        res.setHeader(`Set-Cookie`, `refreshToekn=${refreshToken}`);
        return refreshToken;
    }

}