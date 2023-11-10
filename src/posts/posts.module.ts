import { Module } from '@nestjs/common';
import { ReviewService } from './reviews.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrphanageUser } from 'src/entities/orphanage-user.entity';
import { ReviewProduct } from 'src/entities/review-product.entity';
import { Review } from 'src/entities/review.entity';
import { Product } from 'src/entities/product.entity';
import { PostsService } from './posts.service';
import { Orphanage } from 'src/entities/orphanage.entity';
import { FcmService } from 'src/notifications/fcm.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Orphanage,
      OrphanageUser,
      ReviewProduct,
      Review,
      Product,
    ]),
  ],
  controllers: [PostsController],
  providers: [ReviewService, PostsService, FcmService],
})
export class PostsModule {}
