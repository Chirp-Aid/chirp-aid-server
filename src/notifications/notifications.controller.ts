import { Controller, Post, Body } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { FcmService } from './fcm.service';
import { NotificationDto } from './dto/notification.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('NOTIFICATION: 알림 기능')
@Controller('notifications')
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly fcmService: FcmService,
  ) {}

  @Post()
  async sendNotification(@Body() notificationDto: NotificationDto) {
    const { deviceToken, title, body } = notificationDto;
    await this.fcmService.sendNotification(deviceToken, title, body);
    return { succes: true };
  }
}
