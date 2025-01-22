import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatRoom } from 'src/entities/chat-room.entity';
import { Message } from 'src/entities/message.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ChatsService {
  constructor(
    @InjectRepository(ChatRoom)
    private readonly chatRoomRepository: Repository<ChatRoom>,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  async getAllChatRooms(): Promise<ChatRoom[]> {
    return this.chatRoomRepository
      .createQueryBuilder('chat_room')
      .select([
        'chat_room.chat_room_id',
        'u.user_id',
        'u.name',
        'u.email',
        'u.age',
        'u.sex',
        'u.nickname',
        'u.region',
        'u.phone_number',
        'u.profile_photo',
        'o.orphanage_user_id',
        'o.name',
        'o.email',
      ])
      .innerJoin('chat_room.user', 'u')
      .innerJoin('chat_room.orphanage_user', 'o')
      .getMany();
  }

  async getAllMessages(): Promise<Message[]> {
    return this.messageRepository.find();
  }

  async getChatRoomsByUser(id: string): Promise<ChatRoom[]> {
    return this.chatRoomRepository
      .createQueryBuilder('chat_room')
      .where('chat_room.user.user_id = :user_id', { user_id: id })
      .select([
        'chat_room.chat_room_id',
        'u.user_id',
        'u.name',
        'u.email',
        'u.age',
        'u.sex',
        'u.nickname',
        'u.region',
        'u.phone_number',
        'u.profile_photo',
        'o.orphanage_user_id',
        'o.name',
        'o.email',
        'orph.orphanage_name',
      ])
      .innerJoin('chat_room.user', 'u')
      .innerJoin('chat_room.orphanage_user', 'o')
      .innerJoin('o.orphanage', 'orph')
      .getMany();
  }

  async getChatRoomsByOrphanageUser(id: string): Promise<ChatRoom[]> {
    return this.chatRoomRepository
      .createQueryBuilder('chat_room')
      .where(
        'chat_room.orphanage_user.orphanage_user_id = :orphanage_user_id',
        { orphanage_user_id: id },
      )
      .select([
        'chat_room.chat_room_id',
        'u.user_id',
        'u.name',
        'u.email',
        'u.age',
        'u.sex',
        'u.nickname',
        'u.region',
        'u.phone_number',
        'u.profile_photo',
        'o.orphanage_user_id',
        'o.name',
        'o.email',
      ])
      .innerJoin('chat_room.user', 'u')
      .innerJoin('chat_room.orphanage_user', 'o')
      .getMany();
  }

  async getMessagesByRoom(id: string): Promise<Message[]> {
    return this.messageRepository
      .createQueryBuilder('message')
      .where('message.join_room = :join_room', { join_room: id })
      .getMany();
  }
}
