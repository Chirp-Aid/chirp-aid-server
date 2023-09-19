import { Module } from '@nestjs/common';
import { DonateService } from './donate.service';
import { DonateController } from './donate.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrphanageUser } from 'src/entities/orphanage-user.entity';
import { Orphanage } from 'src/entities/orphanage.entity';
import { Product } from 'src/entities/product.entity';
import { Request } from 'src/entities/request.entity';
import { BasketProduct } from 'src/entities/basket-products.entity';
import { BasketService } from './basket.service';
import { User } from 'src/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Request,
      BasketProduct
    ]),
  ],
  controllers: [DonateController],
  providers: [BasketService]
})
export class DonateModule {}
