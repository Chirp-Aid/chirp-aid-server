import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRequestDto } from './dto/create-request.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Orphanage } from 'src/entities/orphanage.entity';
import { DataSource, Repository } from 'typeorm';
import { OrphanageUser } from 'src/entities/orphanage-user.entity';
import { Request } from 'src/entities/request.entity';
import { Product } from 'src/entities/product.entity';

@Injectable()
export class RequestsService {
  constructor(
    @InjectRepository(Orphanage)
    private orphanageRepository: Repository<Orphanage>,
    @InjectRepository(OrphanageUser)
    private usersRepository: Repository<OrphanageUser>,
    @InjectRepository(Request) private requestRepository: Repository<Request>,
    @InjectRepository(Product) private productRepository: Repository<Product>,
    private dataSource: DataSource,
  ) {}

  async createRequest(createRequestDto: CreateRequestDto, orphanage_user_id: string) {
    const {product_name, count, message } =
      createRequestDto;
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const orphanageUser = await this.usersRepository.findOne({
        where: { orphanage_user_id },
      });

      if (!orphanageUser) {
        throw new NotFoundException('해당 사용자를 찾을 수 없습니다.');
      }

      const product = await this.productRepository.findOne({
        where: { product_name },
      });

      if (!product) {
        throw new NotFoundException('해당 물품을 찾을 수 없습니다.');
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
      return error['response'];
    } finally {
      await queryRunner.release();
    }
  }
}
