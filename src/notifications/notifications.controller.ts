import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { FcmService } from './fcm.service';
import { NotificationDto } from './dto/notification.dto';

@Controller('notifications')
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly fcmService: FcmService) {}

  @Post()
  async sendNotification(@Body() notificationDto: NotificationDto){
    const { deviceToken, title, body } = notificationDto;
    await this.fcmService.sendNotification(deviceToken, title, body);
    return {succes: true};
  }
}
