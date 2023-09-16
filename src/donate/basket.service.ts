import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'src/entities/request.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { AddBasektDto } from './dto/add-basket.dto';

@Injectable()
export class BasektService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Request) private requestRepository: Repository<Request>
    ){}

    async addBasket(userId: string, addBasektDto: AddBasektDto){

    }
}
