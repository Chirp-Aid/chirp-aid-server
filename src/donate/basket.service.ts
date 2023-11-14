import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'src/entities/request.entity';
import { User } from 'src/entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { BasketProduct } from 'src/entities/basket-product.entity';
import { AddBasektDto } from './dto/add-donate.dto';

@Injectable()
export class BasketService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Request) private requestRepository: Repository<Request>,
    @InjectRepository(BasketProduct)
    private basketRepository: Repository<BasketProduct>,
    private dataSource: DataSource,
  ) {}

  async updateCount(userId: string, updateDto: AddBasektDto) {
    const { request_id: requestId, count } = updateDto;
    try {
      const user = await this.userRepository.findOne({
        where: { user_id: userId },
      });

      if (!user) {
        throw new NotFoundException('해당 사용자를 찾을 수 없습니다.');
      }

      const request = await this.requestRepository.findOne({
        where: { request_id: requestId },
      });

      if (!request) {
        throw new NotFoundException('해당 요청을 찾을 수 없습니다.');
      }

      const basket = await this.basketRepository
        .createQueryBuilder('basket_product')
        .where('basket_product.user_id.user_id = :user_id', { user_id: userId })
        .andWhere('basket_product.request_id.request_id = :request_id', {
          request_id: requestId,
        })
        .getOne();

      if (!basket) {
        throw new NotFoundException('해당 장바구니가 존재하지 않습니다.');
      }

      await this.basketRepository.update(
        { user_id: user, request_id: request },
        { count: count },
      );
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async addBasket(userId: string, addBasektDto: AddBasektDto) {
    const { count, request_id: requestId } = addBasektDto;
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = await this.userRepository.findOne({
        where: { user_id: userId },
      });

      if (!user) {
        throw new NotFoundException('해당 사용자를 찾을 수 없습니다.');
      }

      const request = await this.requestRepository.findOne({
        where: { request_id: requestId },
      });

      if (!request) {
        throw new NotFoundException('해당 요청을 찾을 수 없습니다.');
      }

      if (request.count < count) {
        throw new BadRequestException('요청 수량보다 기부 수량이 많습니다.');
      }

      const exist = await this.basketRepository
        .createQueryBuilder('basket_product')
        .where('basket_product.user_id.user_id = :user_id', { user_id: userId })
        .andWhere('basket_product.request_id.request_id = :request_id', {
          request_id: requestId,
        })
        .getOne();

      if (exist) {
        this.basketRepository.update(
          { user_id: user, request_id: request },
          { count: count },
        );
      } else {
        const newBasket = new BasketProduct();
        newBasket.count = count;
        newBasket.user_id = user;
        newBasket.request_id = request;

        await this.basketRepository.save(newBasket);
      }

      await queryRunner.commitTransaction();
      console.log(`Basket Product added : ${addBasektDto}`);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log(error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getBasket(userId) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = await this.userRepository.findOne({
        where: { user_id: userId },
      });

      if (!user) {
        throw new NotFoundException('해당 사용자를 찾을 수 없습니다.');
      }

      const baskets = await this.basketRepository
        .createQueryBuilder('basket_product')
        .select([
          'r.request_id as request_id',
          'basket_product.basket_product_id as basket_product_id',
          'pi.product_name as product_name',
          'pi.product_photo as product_photo',
          'basket_product.count as count',
          'pi.price as price',
          'o.orphanage_name as orphanage_name',
        ])
        .innerJoin('basket_product.user_id', 'u', 'u.user_id = :user_id', {
          user_id: userId,
        })
        .innerJoin('basket_product.request_id', 'r')
        .innerJoin('r.orphanage_user_id', 'ou')
        .innerJoin('ou.orphanage_id', 'o')
        .innerJoin('r.product_id', 'pi')
        .getRawMany();

      console.log(baskets);
      if (!baskets || baskets.length == 0) {
        return [];
      }

      return baskets;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async deleteBasket(userId: string, BasketProductId: number) {
    try {
      const user = await this.userRepository.findOne({
        where: { user_id: userId },
      });

      if (!user) {
        throw new NotFoundException('해당 사용자를 찾을 수 없습니다.');
      }

      const basket = await this.basketRepository.findOne({
        where: { basket_product_id: BasketProductId },
      });

      if (!basket) {
        throw new NotFoundException('해당 장바구니가 존재하지 않습니다.');
      }
      await this.basketRepository.remove(basket);
    } catch (error) {
      throw error;
    }
  }
}
