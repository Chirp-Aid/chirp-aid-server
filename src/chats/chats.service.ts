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

  async getAllChatRooms(): Promise<ChatRoomWithOrphanageName[]> {
    const rawData = await this.chatRoomRepository
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
        'orph.orphanage_name', // orphanage_name 추가
      ])
      .innerJoin('chat_room.user', 'u')
      .innerJoin('chat_room.orphanage_user', 'o')
      .innerJoin('o.orphanage', 'orph') // orphanage와 조인
      .getRawMany(); // Raw 데이터 가져오기

    return rawData.map((row) => ({
      chat_room_id: row.chat_room_chat_room_id,
      user: {
        user_id: row.u_user_id,
        name: row.u_name,
        email: row.u_email,
        age: row.u_age,
        sex: row.u_sex,
        nickname: row.u_nickname,
        region: row.u_region,
        phone_number: row.u_phone_number,
        profile_photo: row.u_profile_photo,
      },
      orphanage_user: {
        orphanage_user_id: row.o_orphanage_user_id,
        name: row.o_name,
        email: row.o_email,
      },
      orphanage_name: row.orph_orphanage_name, // orphanage_name 추가
    }));
  }

  async getChatRoomsByUser(id: string): Promise<ChatRoomWithOrphanageName[]> {
    const rawData = await this.chatRoomRepository
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
      .getRawMany();

    return rawData.map((row) => ({
      chat_room_id: row.chat_room_chat_room_id,
      user: {
        user_id: row.u_user_id,
        name: row.u_name,
        email: row.u_email,
        age: row.u_age,
        sex: row.u_sex,
        nickname: row.u_nickname,
        region: row.u_region,
        phone_number: row.u_phone_number,
        profile_photo: row.u_profile_photo,
      },
      orphanage_user: {
        orphanage_user_id: row.o_orphanage_user_id,
        name: row.o_name,
        email: row.o_email,
      },
      orphanage_name: row.orph_orphanage_name, // orphanage_name 추가
    }));
  }

  async getChatRoomsByOrphanageUser(
    id: string,
  ): Promise<ChatRoomWithOrphanageName[]> {
    const rawData = await this.chatRoomRepository
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
        'orph.orphanage_name', // orphanage_name 추가
      ])
      .innerJoin('chat_room.user', 'u')
      .innerJoin('chat_room.orphanage_user', 'o')
      .innerJoin('o.orphanage', 'orph')
      .getRawMany();

    return rawData.map((row) => ({
      chat_room_id: row.chat_room_chat_room_id,
      user: {
        user_id: row.u_user_id,
        name: row.u_name,
        email: row.u_email,
        age: row.u_age,
        sex: row.u_sex,
        nickname: row.u_nickname,
        region: row.u_region,
        phone_number: row.u_phone_number,
        profile_photo: row.u_profile_photo,
      },
      orphanage_user: {
        orphanage_user_id: row.o_orphanage_user_id,
        name: row.o_name,
        email: row.o_email,
      },
      orphanage_name: row.orph_orphanage_name, // orphanage_name 추가
    }));
  }

  async getMessagesByRoom(id: string): Promise<Message[]> {
    return this.messageRepository
      .createQueryBuilder('message')
      .where('message.join_room = :join_room', { join_room: id })
      .getMany();
  }

  async getAllMessages(): Promise<Message[]> {
    return this.messageRepository.find();
  }
}
