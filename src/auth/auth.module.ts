import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/members/entities/user.entity';
import { AuthController } from './auth.controller';
import { OrphanageUser } from 'src/members/entities/orphanage-user.entity.ts';
import { OrphanageAuthService } from './auth-orphanage.service';

@Module({
  imports: [
    JwtModule.register({}),
    TypeOrmModule.forFeature([User, OrphanageUser]),
  ],
  providers: [JwtService, AuthService, OrphanageAuthService],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
