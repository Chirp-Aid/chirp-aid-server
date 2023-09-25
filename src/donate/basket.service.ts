import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'src/entities/request.entity';
import { User } from 'src/entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { AddBasektDto } from './dto/add-basket.dto';
import { BasketProduct } from 'src/entities/basket-product.entity';

@Injectable()
export class BasketService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Request) private requestRepository: Repository<Request>,
        @InjectRepository(BasketProduct) private basketRepository: Repository<BasketProduct>,
        private dataSource: DataSource
    ){}

    updateCount(request: Request, count: number){
        
    }

    async addBasket(userId: string, addBasektDto: AddBasektDto){
        const {count, request_id: requestId} = addBasektDto;
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try{
            const user = await this.userRepository.findOne({
                where: {user_id: userId},
            });
    
            if(!user){
                throw new NotFoundException('해당 사용자를 찾을 수 없습니다.');
            }

            const request = await this.requestRepository.findOne({
                where: {request_id: requestId},
            });

            if(!request) {
                throw new NotFoundException('해당 요청을 찾을 수 없습니다.');
            }

            const exist = await this.basketRepository
                .createQueryBuilder('basket_product')
                .where('basket_product.user_id.user_id = :user_id', {user_id: userId})
                .andWhere('basket_product.request_id.request_id = :request_id', {request_id: requestId})
                .getOne();

            if(exist){
                throw new ConflictException('해당 물품은 이미 장바구니에 있습니다.');
            }

            const newBasket = new BasketProduct();
            newBasket.count = count;
            newBasket.user_id = user;
            newBasket.request_id = request;

            await this.basketRepository.save(newBasket);

            await queryRunner.commitTransaction();
            console.log(`Basket Product added : ${addBasektDto}`);
            
        } catch(error){
            await queryRunner.rollbackTransaction();
            console.log(error);
            return error['response'];
        } finally {
            await queryRunner.release();
        }
    }

    async getBasket(userId)
    {
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
                'pi.product_name as product_name',
                'basket_product.count as count',
                'pi.price as price',
                'o.orphanage_name as orphanage_name',
            ])
            .innerJoin('basket_product.user_id', 'u', 'u.user_id = :user_id', { user_id: userId })
            .innerJoin('basket_product.request_id', 'r')
            .innerJoin('r.orphanage_user_id', 'ou')
            .innerJoin('ou.orphanage_id', 'o')
            .innerJoin('r.product_id', 'pi')
            .getRawMany();
    
            if (!baskets || baskets.length == 0) {
                return { baskets: [] };
            }

            return {baskets: baskets};

        } catch(error) {
            console.log(error);
            return error['response'];
        }
    }
}
