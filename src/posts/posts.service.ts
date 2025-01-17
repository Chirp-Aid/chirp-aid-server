import { InjectRepository } from '@nestjs/typeorm';
import { Review } from 'src/entities/review.entity';
import { Repository } from 'typeorm';
import { ReviewService } from './reviews.service';
import { Orphanage } from 'src/entities/orphanage.entity';
import { NotFoundException } from '@nestjs/common';

export class PostsService {
  constructor(
    private readonly reviewService: ReviewService,
    @InjectRepository(Review) private reviewRepository: Repository<Review>,
    @InjectRepository(Orphanage)
    private orphanageRepository: Repository<Orphanage>,
  ) {}

  // async getAllPost(){
  //     return await this.reviewRepository.find();
  // }

  async getAllPosts() {
    try {
      const posts = await this.reviewRepository
        .createQueryBuilder('review')
        .select([
          'review.review_id as review_id',
          'review.title as title',
          'review.content as content',
          'review.photo as photos',
          'review.date as date',
          'ou.name as name',
          'o.orphanage_name as orphanage_name',
        ])
        .innerJoin('review.orphanage_user', 'ou')
        .innerJoin('ou.orphanage_id', 'o')
        .getRawMany();

      for (const post of posts) {
        post.product_names = await this.reviewService.getProductNames(
          post.review_id,
        );
        post.photos = post.photos.split(', ');
      }

      return posts;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getOnePost(orphanageId: number) {
    try {
      const orphanage = await this.orphanageRepository.findOne({
        where: { orphanage_id: orphanageId },
      });

      if (!orphanage) {
        throw new NotFoundException('해당 보육원을 찾을 수 없습니다.');
      }

      const posts = await this.reviewRepository
        .createQueryBuilder('review')
        .select([
          'review.review_id as review_id',
          'review.title as title',
          'review.content as content',
          'review.photo as photos',
          'review.date as date',
        ])
        .innerJoin('review.orphanage_user', 'orphanage_user')
        .innerJoin('orphanage_user.orphanage_id', 'orphanage')
        .where('orphanage.orphanage_id = :orphanageId', { orphanageId })
        .getRawMany();

      console.log(posts);

      for (const post of posts) {
        post.product_names = await this.reviewService.getProductNames(
          post.review_id,
        );
        post.photos = post.photos.split(', ');
      }

      return posts;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
