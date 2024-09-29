import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationsModule } from './notifications/notifications.module';
import { MembersModule } from './members/members.module';
import { User } from './entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './auth/jwt/common.module';
import { OrphanagesModule } from './orphanages/orphanages.module';
import { Orphanage } from './entities/orphanage.entity';
import { OrphanageUser } from './entities/orphanage-user.entity';
import { RequestsModule } from './requests/requests.module';
import { Request } from './entities/request.entity';
import { Product } from './entities/product.entity';
import { Favorites } from './entities/favorites.entity';
import { FavoritesModule } from './favorites/favorites.module';
import { DonateModule } from './donate/donate.module';
import { BasketProduct } from './entities/basket-product.entity';
import { PostsModule } from './posts/posts.module';
import { DonationHistory } from './entities/donation-history.entity';
import { Review } from './entities/review.entity';
import { ReviewProduct } from './entities/review-product.entity';
import { ReservationModule } from './reservation/reservation.module';
import { Reservation } from './entities/reservation.entity';
import { AdminModule } from './admin/admin.module';
import { ReportsModule } from './reports/reports.module';
import { Report } from './entities/report.entity';
import { ChatGateway } from './chat/chat.gateway';
import { Message } from './entities/message.entity';
import { ChatRoom } from './entities/chat-room.entity';
import { ChatModule } from './chat/chat.module';
import { ChatsModule } from './chats/chats.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: process.env.DATABASE_TYPE as any,
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [
        User,
        Orphanage,
        OrphanageUser,
        Request,
        Product,
        Favorites,
        BasketProduct,
        DonationHistory,
        Review,
        ReviewProduct,
        Reservation,
        Report,
        Message,
        ChatRoom,
      ],
      synchronize: true,
    }),
    NotificationsModule,
    MembersModule,
    AuthModule,
    CommonModule,
    OrphanagesModule,
    RequestsModule,
    FavoritesModule,
    DonateModule,
    PostsModule,
    ReservationModule,
    AdminModule,
    ReportsModule,
    ChatModule,
    ChatsModule,
  ],
  providers: [ChatGateway],
})
export class AppModule {}
