import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationsModule } from './notifications/notifications.module';
import { MembersModule } from './members/members.module';
import { User } from './entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './auth/jwt/common.module';
import { OrphanagesModule } from './orphanages/orphanages.module';
import { Orphanage } from './entities/orphanage.entity';
import { OrphanageUser } from './entities/orphanage-user.entity';
import { RequestsModule } from './requests/requests.module';
import { Request } from './entities/request.entity';
import { Product } from './entities/product.entity';
import { Favorites } from './entities/favorites.entity';
import { FavoritesModule } from './favorites/favorites.module';
import { DonateModule } from './donate/donate.module';
import { BasketProduct } from './entities/basket-product.entity';
import { PostsModule } from './posts/posts.module';
import { DonationHistory } from './entities/donation-history.entity';
import { Review } from './entities/review.entity';
import { ReviewProduct } from './entities/review-product.entity';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: process.env.DATABASE_TYPE as any,
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [User, Orphanage, OrphanageUser, Request, Product, Favorites,BasketProduct, DonationHistory, Review, ReviewProduct],
      synchronize: true,
    }),
    NotificationsModule,
    MembersModule,
    AuthModule,
    CommonModule,
    OrphanagesModule,
    RequestsModule,
    FavoritesModule,
    DonateModule,
    PostsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
