import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { OrphanageUser } from 'src/entities/orphanage-user.entity';
import { DataSource, Repository } from 'typeorm';
import { Review } from 'src/entities/review.entity';
import { ReviewProduct } from 'src/entities/review-product.entity';
import { Product } from 'src/entities/product.entity';
import * as moment from 'moment-timezone';
import { FcmService } from 'src/notifications/fcm.service';
import { NotificationDto } from 'src/notifications/dto/notification.dto';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(OrphanageUser)
    private userRepository: Repository<OrphanageUser>,
    @InjectRepository(Review) private reviewRepository: Repository<Review>,
    @InjectRepository(ReviewProduct)
    private reviewProductRepository: Repository<ReviewProduct>,
    @InjectRepository(Product) private productRepository: Repository<Product>,
    private dataSource: DataSource,
    private fcmService: FcmService,
  ) {}

  async getTags(userId: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { orphanage_user_id: userId },
      });

      if (!user) {
        throw new NotFoundException('해당 사용자를 찾을 수 없습니다.');
      }

      const tags = await this.reviewProductRepository
        .createQueryBuilder('review_product')
        .select(['p.product_name as product_name'])
        .where(
          'review_product.orphanage_user_id.orphanage_user_id = :user_id',
          { user_id: userId },
        )
        .andWhere('review_product.review_id IS NULL')
        .innerJoin('review_product.product_id', 'p')
        .getRawMany();

      return tags;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async createPost(createPostDto: CreatePostDto, userId: string) {
    const { title, content, photos, products } = createPostDto;
    console.log(photos);
    const queryRunner = await this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      //인증글 중복 방지는 어떻게 하면 좋을지 ...?
      const user = await this.userRepository.findOne({
        where: { orphanage_user_id: userId },
      });

      if (!user) {
        throw new NotFoundException('해당 사용자를 찾을 수 없습니다.');
      }

      const newPost = new Review();
      const currentTime = moment.tz('Asia/Seoul').format('YYYY-MM-DD hh:mm:ss');
      newPost.date = currentTime;
      newPost.title = title;
      newPost.content = content;
      newPost.orphanage_user = user;
      if (photos) newPost.photo = photos;

      await this.reviewRepository.save(newPost);

      for (const product of products) {
        const productInfo = await this.productRepository.findOne({
          where: { product_name: product.product_name },
        });

        this.reviewProductRepository.update(
          { orphanage_user_id: user, product_id: productInfo },
          { review_id: newPost },
        );
      }

      //fcm 전송
      //deviceToken : 기부한 사람의 토큰을 차장야한다....
      //fcm 전송
      // const payload = new NotificationDto();
      // payload.deviceToken = 'orphanageUser.fcm_token';
      // payload.title = '인증글 알림!';
      // payload.body = '새로운 인증글이 올라왔어요.';
      // payload.data.type = 'POST';
      // this.fcmService.sendNotification(payload);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error(error['response']);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getProductNames(reviewId: number) {
    const tags = await this.reviewProductRepository
      .createQueryBuilder('review_product')
      .select(['p.product_name as product_name'])
      .where('review_product.review_id.review_id = :review_id', {
        review_id: reviewId,
      })
      .innerJoin('review_product.product_id', 'p')
      .getRawMany();

    const productNamesArray = tags.map((item) => item.product_name);
    return productNamesArray;
  }
}
