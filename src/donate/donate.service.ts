import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DonateDto } from './dto/donate.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { Request } from 'src/entities/request.entity';
import { BasketProduct } from 'src/entities/basket-product.entity';
import { DonationHistory } from 'src/entities/donation-history.entity';
import * as moment from 'moment-timezone';
import { ReviewProduct } from 'src/entities/review-product.entity';
import { OrphanageUser } from 'src/entities/orphanage-user.entity';

@Injectable()
export class DonateService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(OrphanageUser)
    private orphanageUserRepository: Repository<OrphanageUser>,
    @InjectRepository(Request) private requestRepository: Repository<Request>,
    @InjectRepository(BasketProduct)
    private basketProductRepository: Repository<BasketProduct>,
    @InjectRepository(DonationHistory)
    private donationRepository: Repository<DonationHistory>,
    @InjectRepository(ReviewProduct)
    private reviewProductRepository: Repository<ReviewProduct>,
    private dataSource: DataSource,
  ) {}

  async donate(donateDto: DonateDto, userId: string) {
    const donates = donateDto.basket_product_id;
    const message = donateDto.message;
    // const errors = [];
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

      for (const donateProduct of donates) {
        const basket = await this.basketProductRepository.findOne({
          where: { basket_product_id: donateProduct },
          relations: [
            'request_id',
            'request_id.product_id',
            'request_id.orphanage_user_id',
          ],
        });

        if (!basket) {
          throw new NotFoundException(
            '장바구니에 해당 요청이 존재하지 않습니다.',
          );
        }

        const request = basket.request_id;

        if (!request) {
          throw new NotFoundException(
            `${request.product_id.product_name}: 해당 요청을 찾을 수 없습니다.`,
          );
        }

        if (request.state === 'COMPLETED') {
          throw new ConflictException(
            `${request.product_id.product_name}: 해당 요청은 기부가 완료되었습니다.`,
          );
        }

        if (request.supported_count + basket.count > request.count) {
          throw new ConflictException(
            `${request.product_id.product_name}: 해당 요청의 수량보다 기부 수량이 많습니다.`,
          );
        }

        request.supported_count += basket.count;

        if (request.supported_count >= request.count) {
          request.state = 'COMPLETED';
        }

        const donationHistory = new DonationHistory();
        const currentTime = moment
          .tz('Asia/Seoul')
          .format('YYYY-MM-DD hh:mm:ss');
        donationHistory.date = currentTime;
        donationHistory.count = basket.count;
        donationHistory.message = message;
        donationHistory.request_id = request;
        donationHistory.user_id = user;

        const donatedProduct = new ReviewProduct();
        donatedProduct.product_id = request.product_id;
        donatedProduct.orphanage_user_id = request.orphanage_user_id;

        await this.requestRepository.save(request);
        await this.donationRepository.save(donationHistory);
        await this.reviewProductRepository.save(donatedProduct);
        await this.basketProductRepository.delete(basket);
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error(error['response']);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getUserDonate(userId: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { user_id: userId },
      });

      if (!user) {
        throw new NotFoundException('해당 사용자를 찾을 수 없습니다.');
      }

      const donateInfo = await this.donationRepository
        .createQueryBuilder('donation_history')
        .select([
          'o.orphanage_name as orphanage_name',
          'donation_history.date as date',
          'pi.product_name as product_name',
          'pi.price as price',
          'donation_history.count as count',
          'donation_history.message as message',
        ])
        .innerJoin(
          'donation_history.user_id',
          'user',
          'user.user_id= :user_id',
          { user_id: userId },
        )
        .innerJoin('donation_history.request_id', 'r')
        .innerJoin('r.orphanage_user_id', 'ou')
        .innerJoin('ou.orphanage_id', 'o')
        .innerJoin('r.product_id', 'pi')
        .getRawMany();

      if (!donateInfo || donateInfo.length == 0) {
        return [];
      }

      return donateInfo;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getOrphanDonate(userId: string) {
    try {
      const orphanageUser = await this.orphanageUserRepository.findOne({
        where: { orphanage_user_id: userId },
      });

      if (!orphanageUser) {
        throw new NotFoundException('해당 사용자를 찾을 수 없습니다.');
      }

      const donateInfo = await this.donationRepository
        .createQueryBuilder('donation_history')
        .select([
          'u.nickname as user_nickname',
          'donation_history.date as date',
          'pi.product_name as product_name',
          'pi.price as price',
          'donation_history.count as count',
          'donation_history.message as message',
        ])
        .innerJoin('donation_history.user_id', 'u')
        .innerJoin('donation_history.request_id', 'r')
        .innerJoin('r.orphanage_user_id', 'ou')
        .innerJoin(
          'ou.orphanage_id',
          'o',
          'ou.orphanage_user_id = :orphanage_user_id',
          { orphanage_user_id: userId },
        )
        .innerJoin('r.product_id', 'pi')
        .getRawMany();

      if (!donateInfo || donateInfo.length == 0) {
        console.log('nono');
        return [];
      }

      return donateInfo;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
