import { Module } from "@nestjs/common";
import { JwtRefreshStretagy } from "./jwt-refresh.strategy";
import { JwtAccessStrategy } from "./jwt-acess.strategy";

@Module({
    providers: [JwtRefreshStretagy, JwtAccessStrategy],
    exports: [JwtRefreshStretagy, JwtAccessStrategy],
})
export class CommonModule{}