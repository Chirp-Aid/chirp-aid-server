import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { BaseAPIDocument } from './global/util/swagger.config';

dotenv.config({
  path: path.resolve('.env'),
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  BaseAPIDocument(app);

  await app.listen(3000);
}
bootstrap();
