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
        const donates = donateDto.Donates;
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
                const requestId = donateProduct.request_id;
    
                const request = await this.requestRepository.findOne({
                    where: { request_id: requestId },
                    relations:['product_id']
                });
    
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

                if(request.supported_count + donateProduct.count > request.count){
                    // const errorMessage = `${request.product_id.product_name}: 해당 요청의 수량보다 기부 수량이 많습니다.`;
                    // errors.push(errorMessage)
                    throw new ConflictException(`${request.product_id.product_name}: 해당 요청의 수량보다 기부 수량이 많습니다.`)
                }

                request.supported_count += donateProduct.count;

                if (request.supported_count >= request.count) {
                    request.state = 'COMPLETED';
                }

                const donationHistory = new DonationHistory();
                donationHistory.date = new Date();
                donationHistory.count = donateProduct.count;
                donationHistory.message = message;
                donationHistory.request_id = request;
                donationHistory.user_id = user;
                
                await this.requestRepository.save(request);
                await this.donationRepository.save(donationHistory);
            }

            // if (errors.length > 0)
            // {
            //     throw new ConflictException(errors.join('\n'));
            // }
            await queryRunner.commitTransaction();
            console.log("COMMIT");

        } catch (error) {
            await queryRunner.rollbackTransaction();
            console.error(error['response'])
            return error['response'];
            // throw error;
        } finally {
            await queryRunner.release();
        }
    }

    deleteDonate(donate_id: number){
        
    }
}
