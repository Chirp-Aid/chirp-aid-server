import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminBoardController } from './admin-board.controller';
import { AdminBoardService } from './admin-board.service';
import { Request } from 'src/entities/request.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Request])],
  controllers: [AdminBoardController],
  providers: [AdminBoardService],
})
export class AdminBoardModule {}
