import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'src/entities/request.entity';
import { User } from 'src/entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { AddBasektDto } from './dto/add-basket.dto';
import { BasketProducts } from 'src/entities/basket-products.entity';

@Injectable()
export class BasektService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Request) private requestRepository: Repository<Request>,
        @InjectRepository(BasketProducts) private basketRepository: Repository<BasketProducts>,
        private dataSource: DataSource
    ){}

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

            const newBasket = new BasketProducts();
            newBasket.count = count;
            newBasket.request_id = request;
            newBasket.user_id = user;

            await this.basketRepository.save(newBasket);
            await queryRunner.commitTransaction();
            console.log(`Basekt Product added : ${newBasket.user_id}`);
            
        } catch(error){
            await queryRunner.rollbackTransaction();
            console.log(error);
            return error['response'];
        } finally {
            await queryRunner.release();
        }
    }

    async getBasket(userId: string)
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

            const baskets = await this.basketRepository.find({
                where: { user_id: user },
                relations: ['request_id'],
            });

            console.log(baskets);

            if (!baskets || baskets.length == 0) {
                return { baskets: [] };
            }


        } catch(error) {
            console.log(error);
            return error['response'];
        }
    }
}
