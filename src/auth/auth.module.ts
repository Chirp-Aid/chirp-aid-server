import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { AuthController } from './auth.controller';
import { OrphanageUser } from '../entities/orphanage-user.entity';
import { OrphanageAuthService } from './auth-orphanage.service';
import { Orphanage } from 'src/entities/orphanage.entity';

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
