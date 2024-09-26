import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { ChatRoom } from 'src/entities/chat-room.entity';
import { Message } from 'src/entities/message.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChatRoom, Message])], // ChatRoom과 Message 엔티티를 TypeORM 모듈에 등록
  providers: [ChatService, ChatGateway],
  exports: [ChatService],
})
export class ChatModule {}
