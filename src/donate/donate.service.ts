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

    async addDonationHistory(request: Request, user: User, count: number, message: string) {
        const donationHistory = new DonationHistory();
        donationHistory.date = new Date();
        donationHistory.count = count;
        donationHistory.message = message;
        donationHistory.request_id = request;
        donationHistory.user_id = user;

        await this.donationRepository.save(donationHistory);
    }

    async donate(donateDto: DonateDto, userId: string){
        const donates = donateDto.Donates;
        const message = donateDto.message;
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
                    throw new NotFoundException(`${request.product_id.product_name}: 해당 요청을 찾을 수 없습니다.`);
                }
    
                if (request.state === 'COMPLETED') {
                    throw new ConflictException(`${request.product_id.product_name}: 해당 요청은 기부가 완료되었습니다.`);
                }

                request.supported_count += donateProduct.count;

                if (request.supported_count >= request.count) {
                    request.state = 'COMPLETED';
                }

                // 변경사항을 저장합니다.
                await this.requestRepository.save(request);
                await this.addDonationHistory(request, user, donateProduct.count, message);

            }

            await queryRunner.commitTransaction();
        } catch (error) {
            // 오류 발생 시 롤백합니다.
            await queryRunner.rollbackTransaction();
            throw error; // 또는 오류를 처리하는 방식에 따라 다르게 처리할 수 있습니다.
        } finally {
            // 쿼리 러너를 해제합니다.
            await queryRunner.release();
        }
    
    }
}
