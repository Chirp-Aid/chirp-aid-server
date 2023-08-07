import { Module } from '@nestjs/common';
import { OrphanageUsersService } from './orphanage-user.service';
import { MembersController } from './members.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { OrphanageUser } from '../entities/orphanage-user.entity';
import { Orphanage } from 'src/entities/orphanage.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, OrphanageUser, Orphanage])],
  controllers: [MembersController],
  providers: [OrphanageUsersService, UsersService],
})
export class MembersModule {}
