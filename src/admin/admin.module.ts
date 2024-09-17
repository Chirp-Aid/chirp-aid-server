import { Module } from '@nestjs/common';
import { AdminOrphanageModule } from './orphanage/admin-orphanage.module';
import { AdminBoardModule } from './post/admin-board.module';
import { AdminUserModule } from './user/admin-user.module';
import { AdminOrphanageUsersModule } from './orphanageUser/admin-orphanage-user.module';

@Module({
  imports: [
    AdminUserModule,
    AdminOrphanageUsersModule,
    AdminOrphanageModule,
    AdminBoardModule,
  ],
})
export class AdminModule {}
