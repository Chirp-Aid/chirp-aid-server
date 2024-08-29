import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { FcmService } from './fcm.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [NotificationsController],
  providers: [FcmService],
  exports: [FcmService],
})
export class NotificationsModule {}
