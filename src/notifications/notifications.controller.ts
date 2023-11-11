import { Controller, Post, Body } from '@nestjs/common';
import { FcmService } from './fcm.service';
import { NotificationDto } from './dto/notification.dto';

@Controller('notifications')
export class NotificationsController {
  constructor(
    private readonly fcmService: FcmService,
  ) {}

  @Post()
  async sendNotification(@Body() notificationDto: NotificationDto) {
    await this.fcmService.sendNotification(notificationDto);
    return { succes: true };
  }
}
