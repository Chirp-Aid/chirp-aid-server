import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { ChatRoom } from 'src/entities/chat-room.entity';
import { Message } from 'src/entities/message.entity';
import { User } from 'src/entities/user.entity';
import { OrphanageUser } from 'src/entities/orphanage-user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChatRoom, Message, User, OrphanageUser])],
  providers: [ChatService, ChatGateway],
  exports: [ChatService],
})
export class ChatModule {}
