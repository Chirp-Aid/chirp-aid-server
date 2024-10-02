import { Module } from '@nestjs/common';
import { ChatsController } from './chats.controller';
import { ChatsService } from './chats.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatRoom } from 'src/entities/chat-room.entity';
import { Message } from 'src/entities/message.entity';
import { User } from 'src/entities/user.entity';
import { OrphanageUser } from 'src/entities/orphanage-user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChatRoom, Message, User, OrphanageUser])],
  controllers: [ChatsController],
  providers: [ChatsService],
})
export class ChatsModule {}
