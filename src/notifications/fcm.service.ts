import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';

@Injectable()
export class FcmService {
  private fcm: admin.messaging.Messaging;
  private firebaseConfig: any;

  constructor() {
    this.firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);



    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(this.firebaseConfig),
      });}

    // this.fcm = admin.messaging();
  }

  async sendNotification(deviceToken: string, title: string,body: string, data): Promise<string> {
    const message: admin.messaging.Message = {
      token: deviceToken,
      notification: {
        title: title,
        body: body,
      },
      data: data
    };
    console.log(message);

    try {
      const response = await this.fcm.send(message);
      return response;
    } catch (error) {
      throw new HttpException(
        'Failed to send notification',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  // FCM 관련 메서드 작성
}
