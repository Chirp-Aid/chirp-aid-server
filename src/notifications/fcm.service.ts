import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';

@Injectable()
export class FcmService {
  private fcm: admin.messaging.Messaging;
  private firebaseConfig: any;

  constructor() {
    // this.firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);

    // admin.initializeApp({
    //   credential: admin.credential.cert(this.firebaseConfig),
    //   // 다른 Firebase 설정 (옵션)
    //   // databaseURL: 'https://your-project-id.firebaseio.com',
    //   // storageBucket: 'your-project-id.appspot.com',
    // });

    // this.fcm = admin.messaging();
  }

  init(){
    this.firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);

    admin.initializeApp({
      credential: admin.credential.cert(this.firebaseConfig),
      // 다른 Firebase 설정 (옵션)
      // databaseURL: 'https://your-project-id.firebaseio.com',
      // storageBucket: 'your-project-id.appspot.com',
    });

    this.fcm = admin.messaging();
  }

  async sendNotification(deviceToken: string, title: string,body: string, ): Promise<string> {
    const message: admin.messaging.Message = {
      notification: {
        title: title,
        body: body,
      },
      token: deviceToken,
    };

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
