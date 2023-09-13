import { Module } from '@nestjs/common';
import { DonateService } from './donate.service';
import { DonateController } from './donate.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrphanageUser } from 'src/entities/orphanage-user.entity';
import { Orphanage } from 'src/entities/orphanage.entity';
import { Product } from 'src/entities/product.entity';
import { Request } from 'src/entities/request.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrphanageUser, Orphanage, Request, Product]),
  ],
  controllers: [DonateController],
  providers: [DonateService]
})
export class DonateModule {}
