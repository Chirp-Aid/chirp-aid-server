import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from "dotenv"
import * as path from "path"
import { BaseAPIDocument } from './swagger.document';
import { SwaggerModule } from '@nestjs/swagger';


dotenv.config({
  path: path.resolve('.env')
})

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const swaggerConfig = new BaseAPIDocument().initializeOptions();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
