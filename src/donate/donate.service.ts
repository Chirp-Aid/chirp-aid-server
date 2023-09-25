import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { DonateDto } from './dto/donate.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { Request } from 'src/entities/request.entity';
import { BasketProduct } from 'src/entities/basket-product.entity';
import { DonationHistory } from 'src/entities/donation-history.entity';

@Injectable()
export class DonateService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Request) private requestRepository: Repository<Request>,
        @InjectRepository(BasketProduct) private basketProductRepository: Repository<BasketProduct>,
        @InjectRepository(DonationHistory) private donationRepository: Repository<DonationHistory>,
        private dataSource: DataSource
    ){}

    async donate(donateDto: DonateDto, userId: string){
        const donates = donateDto.basket_product_id;
        const message = donateDto.message;
        // const errors = [];
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const user = await this.userRepository.findOne({
                where: {user_id: userId},
            });
    
            if(!user){
                throw new NotFoundException('해당 사용자를 찾을 수 없습니다.');
            }

            for (const donateProduct of donates) {
                const basketId = donateProduct;

                const basket = await this.basketProductRepository.findOne({
                    where: {basket_product_id: basketId},
                    relations:['request_id', 'request_id.product_id']
                })

                if (!basket) {
                    throw new NotFoundException('장바구니에 해당 요청이 존재하지 않습니다.');
                }

                const request = basket.request_id;
    
                if (!request) {
                    // const errorMessage = `${request.product_id.product_name}: 해당 요청을 찾을 수 없습니다.`;
                    // errors.push(errorMessage);
                    throw new NotFoundException(`${request.product_id.product_name}: 해당 요청을 찾을 수 없습니다.`);
                }
    
                if (request.state === 'COMPLETED') {
                    // const errorMessage = `${request.product_id.product_name}: 해당 요청은 기부가 완료되었습니다.`;
                    // errors.push(errorMessage);
                    throw new ConflictException(`${request.product_id.product_name}: 해당 요청은 기부가 완료되었습니다.`);
                }

                if(request.supported_count + basket.count > request.count){
                    // const errorMessage = `${request.product_id.product_name}: 해당 요청의 수량보다 기부 수량이 많습니다.`;
                    // errors.push(errorMessage)
                    throw new ConflictException(`${request.product_id.product_name}: 해당 요청의 수량보다 기부 수량이 많습니다.`)
                }

                request.supported_count += basket.count;

                if (request.supported_count >= request.count) {
                    request.state = 'COMPLETED';
                }

                const donationHistory = new DonationHistory();
                donationHistory.date = new Date();
                donationHistory.count = basket.count;
                donationHistory.message = message;
                donationHistory.request_id = request;
                donationHistory.user_id = user;
                
                await this.requestRepository.save(request);
                await this.donationRepository.save(donationHistory);
                await this.basketProductRepository.delete(basket);
            }

            await queryRunner.commitTransaction();

        } catch (error) {
            await queryRunner.rollbackTransaction();
            console.error(error['response'])
            return error['response'];
        } finally {
            await queryRunner.release();
        }
    }

}
