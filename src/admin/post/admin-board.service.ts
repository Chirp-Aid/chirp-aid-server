import { Injectable, NotFoundException, Param } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Request } from 'src/entities/request.entity';

@Injectable()
export class AdminBoardService {
  constructor(
    @InjectRepository(Request)
    private requestRepository: Repository<Request>,
    private dataSource: DataSource,
  ) {}

  async findAllRequest(): Promise<Request[]> {
    return this.requestRepository.createQueryBuilder('request').getMany();
  }
  async findRequestById(requestId: number): Promise<Request> {
    const request = await this.requestRepository
      .createQueryBuilder('request')
      .where('request.request_id = :id', { id: requestId }) // 컬럼 이름 수정
      .getOne();

    if (!request) {
      throw new NotFoundException('해당하는 요청글이 없습니다.');
    }
    return request;
  }

  async deleteRequestById(requestId: number): Promise<void> {
    const request = await this.requestRepository.findOne({
      where: { request_id: requestId },
    });
    if (!request) {
      throw new NotFoundException('해당하는 요청글이 없습니다.');
    }
    await this.requestRepository.remove(request);
  }
}
