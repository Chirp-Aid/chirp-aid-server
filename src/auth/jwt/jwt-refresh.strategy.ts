import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-jwt";

export class JwtRefreshStretagy extends PassportStrategy(Strategy, 'refresh') {
    constructor() {
        super({
            jwtFromRequest: (req) => {
                const cookie = req.cookies['refreshToken'];
                return cookie;
            },
            secretOrKey: process.env.JWT_REFRESH_TOKEN,
        });
    }

    validate(payload) {
        console.log(payload);
        return {
            email: payload.email,
            user_id: payload.sub,
        };
    }
}