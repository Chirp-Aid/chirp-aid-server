import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import { NotificationDto } from './dto/notification.dto';

@Injectable()
export class FcmService {
  private firebaseConfig: any;

  constructor() {
    const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);
    firebaseConfig.private_key = firebaseConfig.private_key.replace(
      /\\n/g,
      '\n',
    );
    this.firebaseConfig = firebaseConfig;

    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(this.firebaseConfig),
      });
    }
  }

  async sendNotification(dto: NotificationDto): Promise<string> {
    const { deviceToken, title, body, data } = dto;
    const message: admin.messaging.Message = {
      token: deviceToken,
      notification: {
        title: title,
        body: body,
      },
      data: data,
    };
    console.log(message);

    try {
      const response = await admin.messaging().send(message);

      return response;
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Failed to send notification',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
