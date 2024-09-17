import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminOrphanageUsersController } from './admin-orphanage-user.controller';
import { AdminOrphanageUsersService } from './admin-orphanage-user.service';
import { OrphanageUser } from 'src/entities/orphanage-user.entity';
import { Orphanage } from 'src/entities/orphanage.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrphanageUser, Orphanage])],
  controllers: [AdminOrphanageUsersController],
  providers: [AdminOrphanageUsersService],
})
export class AdminOrphanageUsersModule {}
