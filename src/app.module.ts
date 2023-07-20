import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationsModule } from './notifications/notifications.module';
import { MembersModule } from './members/members.module';
import { User } from './members/entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './auth/jwt/common.module';
import { OrphanagesModule } from './orphanages/orphanages.module';
import { Orphanage } from './orphanages/entities/orphanage.entity';
import { OrphanageUser } from './members/entities/orphanage-user.entity.ts';
@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
  }),
  TypeOrmModule.forRoot({
    type: process.env.DATABASE_TYPE as any,
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    entities: [User, Orphanage, OrphanageUser],
    synchronize: true,
  }),
  NotificationsModule,
  MembersModule,
  AuthModule,
  CommonModule,
  OrphanagesModule
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
