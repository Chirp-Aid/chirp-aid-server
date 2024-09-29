import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ChatsService } from './chats.service';
import { ChatRoom } from 'src/entities/chat-room.entity';
import { Message } from 'src/entities/message.entity';

@Controller('chats')
@UseGuards(AuthGuard('access'))
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @Get('/rooms')
  async getAllChatRooms(): Promise<ChatRoom[]> {
    return await this.chatsService.getAllChatRooms();
  }

  @Get('/messages')
  async getAllMessages(): Promise<Message[]> {
    return await this.chatsService.getAllMessages();
  }

  @Get('/rooms/user')
  async getChatRoomsByUser(@Query('id') id: string): Promise<ChatRoom[]> {
    return await this.chatsService.getChatRoomsByUser(id);
  }

  @Get('/rooms/orphanage-user')
  async getChatRoomsByOrphanageUser(
    @Query('id') id: string,
  ): Promise<ChatRoom[]> {
    return await this.chatsService.getChatRoomsByOrphanageUser(id);
  }

  @Get('/messages/room')
  async getMessagesByRoom(@Query('id') id: string): Promise<Message[]> {
    return await this.chatsService.getMessagesByRoom(id);
  }
}
