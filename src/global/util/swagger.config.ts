import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

/**
 * Swagger 세팅
 *
 * @param {INestApplication} app
 */
export function BaseAPIDocument(app: INestApplication): void {
  const options = new DocumentBuilder()
    .setTitle('Chirp-Aid(칩에이드)')
    .setDescription('Chirp-Aid Swagger API 서버 (최근 수정 : 2023.10.05)')
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'Bearer',
        bearerFormat: 'JWT',
      },
      'Authorization', // 헤더에 들어갈 토큰의 이름
    )
    .addTag('Chirp-Aid API')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: { cache: false }, // 캐시 방지 옵션 추가
  });
}
