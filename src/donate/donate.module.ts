import { Module } from '@nestjs/common';
import { DonateController } from './donate.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Request } from 'src/entities/request.entity';
import { BasketService } from './basket.service';
import { User } from 'src/entities/user.entity';
import { BasketProduct } from 'src/entities/basket-product.entity';
import { DonationHistory } from 'src/entities/donation-history.entity';
import { DonateService } from './donate.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Request,
      BasketProduct,
      DonationHistory,
    ]),
  ],
  controllers: [DonateController],
  providers: [BasketService, DonateService]
})
export class DonateModule {}
