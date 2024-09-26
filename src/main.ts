import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { BaseAPIDocument } from './global/util/swagger.config';
import { IoAdapter } from '@nestjs/platform-socket.io';

dotenv.config({
  path: path.resolve('.env'),
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  BaseAPIDocument(app);

  app.useWebSocketAdapter(new IoAdapter(app));

  await app.listen(3000);
}
bootstrap();
