import { Injectable, NotFoundException, Param } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Request } from 'src/entities/request.entity';
import { Review } from 'src/entities/review.entity';

@Injectable()
export class AdminBoardService {
  constructor(
    @InjectRepository(Request)
    private requestRepository: Repository<Request>,

    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
  ) {}

  async findAllRequest(): Promise<Request[]> {
    return this.requestRepository.createQueryBuilder('request').getMany();
  }
  async findRequestById(requestId: number): Promise<Request> {
    const request = await this.requestRepository
      .createQueryBuilder('request')
      .where('request.request_id = :id', { id: requestId })
      .getOne();

    if (!request) {
      throw new NotFoundException('해당하는 요청글이 없습니다.');
    }
    return request;
  }

  async deleteRequestById(requestId: number): Promise<void> {
    const request = await this.requestRepository.findOne({
      where: { request_id: requestId },
    });
    if (!request) {
      throw new NotFoundException('해당하는 요청글이 없습니다.');
    }
    await this.requestRepository.remove(request);
  }

  async findAllPost(): Promise<Review[]> {
    return this.reviewRepository.createQueryBuilder('review').getMany();
  }

  async findPostById(reviewId: number): Promise<Review> {
    const review = await this.reviewRepository.findOne({
      where: { review_id: reviewId },
    });
    if (!review) {
      throw new NotFoundException('해당하는 인증글이 없습니다.');
    }
    return review;
  }

  async deletePostById(reviewId: number) {
    const deletePost = await this.reviewRepository.findOne({
      where: { review_id: reviewId },
    });
    if (!deletePost) {
      throw new NotFoundException('해당하는 인증글이 없습니다.');
    }
    await this.reviewRepository.delete(deletePost);
  }
}
