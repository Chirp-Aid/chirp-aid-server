import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { OrphanageUser } from 'src/entities/orphanage-user.entity';
import { DataSource, Repository } from 'typeorm';
import { Review } from 'src/entities/review.entity';
import { ReviewProduct } from 'src/entities/review-product.entity';
import { Product } from 'src/entities/product.entity';
import * as moment from 'moment-timezone';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(OrphanageUser) private userRepository: Repository<OrphanageUser>,
    @InjectRepository(Review) private reviewRepository: Repository<Review>,
    @InjectRepository(ReviewProduct) private reviewProductRepository: Repository<ReviewProduct>,
    @InjectRepository(Product) private productRepository: Repository<Product>,
    private dataSouce:DataSource,
  ){}

  async getTags(userId: string) {
    try{
      const user = await this.userRepository.findOne({
        where: {orphanage_user_id: userId}
      });

      if(!user){
        throw new NotFoundException('해당 사용자를 찾을 수 없습니다.');
      }

      const tags = await this.reviewProductRepository
        .createQueryBuilder('review_product')
        .select([
          'p.product_name as product_name'
        ])
        .where('review_product.orphanage_user_id.orphanage_user_id = :user_id', {user_id: userId})
        .andWhere('review_product.review_id IS NULL')
        .innerJoin('review_product.product_id', 'p')
        .getRawMany();

      return tags

    } catch(error){
      console.error(error);
      return error['response'];
    }
  }

  async createPost(createPostDto: CreatePostDto, userId: string){
    const {title, content, photo, products} = createPostDto;
    const queryRunner = await this.dataSouce.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try{ //인증글 중복 방지는 어떻게 하면 좋을지 ...?
      const user = await this.userRepository.findOne({
        where: {orphanage_user_id: userId},
      });

      if(!user){
          throw new NotFoundException('해당 사용자를 찾을 수 없습니다.');
      }

      const newPost = new Review();
      const currentTime = moment.tz('Asia/Seoul').format('YYYY-MM-DD hh:mm:ss');
      newPost.date = currentTime;
      newPost.title = title;
      newPost.content = content;
      newPost.orphanage_user = user;
      if(photo) newPost.photo = photo;

      await this.reviewRepository.save(newPost);

      for (const product of products){
        const productInfo = await this.productRepository.findOne({
          where: {product_name: product.product_name}
        })

        this.reviewProductRepository.update({orphanage_user_id: user, product_id: productInfo},{review_id: newPost},)
      }

      await queryRunner.commitTransaction();

    } catch(error){
      await queryRunner.rollbackTransaction();
      console.error(error['response'])
      return error['response'];
    } finally {
      await queryRunner.release();
    }
  }

  async getProductNames(reviewId: number){
    const tags = await this.reviewProductRepository
    .createQueryBuilder('review_product')
    .select([
      'p.product_name as product_name'
    ])
    .where('review_product.review_id.review_id = :review_id', {review_id: reviewId})
    .innerJoin('review_product.product_id', 'p')
    .getRawMany();

    const productNamesArray = tags.map(item => item.product_name);
    return productNamesArray;
  }
}
