import { Module } from '@nestjs/common';
import { DonateService } from './donate.service';
import { DonateController } from './donate.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrphanageUser } from 'src/entities/orphanage-user.entity';
import { Orphanage } from 'src/entities/orphanage.entity';
import { Product } from 'src/entities/product.entity';
import { Request } from 'src/entities/request.entity';
import { BasketProducts } from 'src/entities/basket-products.entity';
import { BasektService } from './basket.service';
import { User } from 'src/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Request,
      BasketProducts
    ]),
  ],
  controllers: [DonateController],
  providers: [BasektService]
})
export class DonateModule {}
