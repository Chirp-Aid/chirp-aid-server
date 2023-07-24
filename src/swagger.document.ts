import { DocumentBuilder } from '@nestjs/swagger';

export class BaseAPIDocument {
  public builder = new DocumentBuilder();
  public initializeOptions() {
    return (
      this.builder
        .setTitle('Chirp-Aid(칩에이드)')
        .setDescription('Chirp-Aid Swagger API 서버')
        .setVersion('1.0.0')
        // .addBearerAuth(
        //     {
        //         type: 'http'
        //         scheme: ''
        //         name: 'JWT'
        //         in: 'header'
        //     },
        //     access-token',
        // )
        .build()
    );
  }
}
