import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/members/entities/user.entity';
import { AuthController } from './auth.controller';

@Module({
    imports: [
        JwtModule.register({}),
        TypeOrmModule.forFeature([User])
    ],
    providers: [JwtService, AuthService],
    exports: [AuthService],
    controllers: [AuthController]
})
export class AuthModule {}