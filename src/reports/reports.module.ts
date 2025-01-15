import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Report } from 'src/entities/report.entity';
import { User } from 'src/entities/user.entity';
import { OrphanageUser } from 'src/entities/orphanage-user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Report, User, OrphanageUser])],
  providers: [ReportsService],
  controllers: [ReportsController],
})
export class ReportsModule {}
