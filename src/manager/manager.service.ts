import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Orphanage } from "src/entities/orphanage.entity";
import { Repository } from "typeorm";

@Injectable()
export class ManagerService{
    constructor(
        @InjectRepository(Orphanage)
        private orphanageRepository: Repository<Orphanage>,  // TypeORM Repository로 선언
      ) {}
    
    async getAllOrphanage():Promise<Orphanage[]>
    {
        return this.orphanageRepository
      .createQueryBuilder('orphanage')
      .getMany();
    }
}