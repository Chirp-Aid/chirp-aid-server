import { DocumentBuilder } from '@nestjs/swagger';

export class BaseAPIDocument {
  public builder = new DocumentBuilder();
  public initializeOptions() {
    return (
      this.builder
        .setTitle('Chirp-Aid(칩에이드)')
        .setDescription('Chirp-Aid Swagger API 서버')
        .setVersion('1.0.0')
        .addBearerAuth({
            type: 'http',
            scheme: 'Bearer',
            bearerFormat: 'JWT'
          },
          'Authorization', // 헤더에 들어갈 토큰의 이름
        )
        .addTag('Chirp-Aid API')
        .build()
    );
  }
}