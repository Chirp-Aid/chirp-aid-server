import { Controller, Post, Body } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { FcmService } from './fcm.service';
import { NotificationDto } from './dto/notification.dto';

@Controller('notifications')
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly fcmService: FcmService,
  ) {}

  @Post()
  async sendNotification(@Body() notificationDto: NotificationDto) {
    const { deviceToken, title, body, data } = notificationDto;
    await this.fcmService.sendNotification(deviceToken, title, body, data);
    return { succes: true };
  }
}
