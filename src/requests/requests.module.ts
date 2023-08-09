import { Module } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { RequestsController } from './requests.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrphanageUser } from 'src/entities/orphanage-user.entity';
import { Orphanage } from 'src/entities/orphanage.entity';
import { Request } from 'src/entities/request.entity';
import { Product } from 'src/entities/product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrphanageUser, Orphanage, Request, Product]),
  ],
  controllers: [RequestsController],
  providers: [RequestsService],
})
export class RequestsModule {}
