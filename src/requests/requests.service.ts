import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRequestDto } from './dto/create-request.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { OrphanageUser } from 'src/entities/orphanage-user.entity';
import { Request } from 'src/entities/request.entity';
import { Product } from 'src/entities/product.entity';

@Injectable()
export class RequestsService {
  constructor(
    @InjectRepository(OrphanageUser)
    private usersRepository: Repository<OrphanageUser>,
    @InjectRepository(Request) private requestRepository: Repository<Request>,
    @InjectRepository(Product) private productRepository: Repository<Product>,
    private dataSource: DataSource,
  ) {}

  async createRequest(
    createRequestDto: CreateRequestDto,
    orphanageUserId: string,
  ) {
    const { product_name: productName, count, message } = createRequestDto;
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const orphanageUser = await this.usersRepository.findOne({
        where: { orphanage_user_id: orphanageUserId },
      });

      if (!orphanageUser) {
        throw new NotFoundException('해당 사용자를 찾을 수 없습니다.');
      }

      const product = await this.productRepository.findOne({
        where: { product_name: productName },
      });

      if (!product) {
        throw new NotFoundException('해당 물품을 찾을 수 없습니다.');
      }

      const exist = await this.requestRepository
        .createQueryBuilder('requests')
        .where(
          'requests.orphanage_user_id.orphanage_user_id = :orphanage_user_id',
          { orphanage_user_id: orphanageUserId },
        )
        .andWhere('requests.product_id = :product_id', {
          product_id: product.product_id,
        })
        .getOne();

      if (exist) {
        throw new ConflictException('이미 해당 요청이 존재합니다.');
      }

      const newRequest = new Request();
      newRequest.count = count;
      newRequest.message = message;
      newRequest.orphanage_user_id = orphanageUser;
      newRequest.product_id = product;

      await this.requestRepository.save(newRequest);
      await queryRunner.commitTransaction();
      console.log(`Reqeust Added : ${createRequestDto.product_name}`);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log(error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
