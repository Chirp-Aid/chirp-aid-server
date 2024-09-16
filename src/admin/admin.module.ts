import { Module } from '@nestjs/common';
import { AdminOrphanageModule } from './orphanage/admin-orphanage.module';
import { AdminBoardModule } from './post/admin-board.module';

@Module({
  imports: [AdminOrphanageModule, AdminBoardModule],
})
export class AdminModule {}
