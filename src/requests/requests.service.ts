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
import axios from 'axios';
import { crawlingRequest } from './dto/crawling-request.dto';
import { deleteRequest } from './dto/delete-request.dto';

@Injectable()
export class RequestsService {
  private readonly NAVER_CLIENT_ID = process.env.NAVER_CLIENT_ID; // 네이버 클라이언트 ID
  private readonly NAVER_CLIENT_SECRET = process.env.NAVER_CLIENT_SECRET; // 네이버 클라이언트 시크릿
  private readonly NAVER_API_URL = process.env.NAVER_API_URL;

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
    const { product_id: productId, count, message } = createRequestDto;
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
        where: { product_id: productId },
      });

      console.log(`product: ${productId}`);

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
          product_id: productId,
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

      console.log(newRequest);
      await this.requestRepository.save(newRequest);
      await queryRunner.commitTransaction();
      console.log(`Reqeust Added : ${product.product_name}`);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log(error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async searchProduct(query: string) {
    const headers = {
      'X-Naver-Client-Id': this.NAVER_CLIENT_ID,
      'X-Naver-Client-Secret': this.NAVER_CLIENT_SECRET,
    };

    try {
      const response = await axios.get(this.NAVER_API_URL, {
        headers: headers,
        params: { query: query, display: 3 },
      });
      return response.data.items.map((item) => ({
        title: item.title,
        price: item.lprice,
        image: item.image,
        link: item.link,
      }));
    } catch (error) {
      console.error(
        'Naver API Error:',
        error.response?.status,
        error.response?.data,
      );
      throw new Error('Failed to fetch data');
    }
  }

  async insertCrawlingProduct(crawlingRequest: crawlingRequest) {
    const { title, price, image, link } = crawlingRequest;

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const newProduct = new Product();
      newProduct.product_name = title;
      newProduct.price = price;
      newProduct.product_photo = image;
      newProduct.product_link = link;
      const product = await queryRunner.manager.save(newProduct);
      await queryRunner.commitTransaction();
      console.log(`save User : ${product.product_name}`);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log(error['response']);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async deleteRequestByRequestId(
    orphanageUserId: string,
    deleteRequest: deleteRequest,
  ) {
    const { request_id: requestId } = deleteRequest;

    const deleteRequestBoard = await this.requestRepository
      .createQueryBuilder('request')
      .where('user.orphanage_user_id = :orphanage_user_id', {
        request_id: requestId,
      })
      .getOne();

    if (!deleteRequestBoard) {
      throw new NotFoundException(
        `해당 orphanageUserId (${orphanageUserId})에 대한 삭제할 요청이 존재하지 않습니다.`,
      );
    }

    await this.requestRepository.remove(deleteRequestBoard);
    console.log(`Request deleted for orphanageUserId: ${orphanageUserId}`);
  }
}
