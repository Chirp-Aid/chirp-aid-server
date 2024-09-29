import { InjectRepository } from '@nestjs/typeorm';
import { ChatRoom } from 'src/entities/chat-room.entity';
import { Message } from 'src/entities/message.entity';
import { Repository } from 'typeorm';
import { CreateRoomDto } from './dto/createRoom.dto';
import { SendMessageDto } from './dto/sendMessage.dto';
import { User } from 'src/entities/user.entity';
import { OrphanageUser } from 'src/entities/orphanage-user.entity';
import * as uuid from 'uuid';

export class ChatService {
  constructor(
    @InjectRepository(ChatRoom)
    private chatRoomRepository: Repository<ChatRoom>,
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(OrphanageUser)
    private orphanageUserRepository: Repository<OrphanageUser>,
  ) {}

  async findRoomById(id: string): Promise<ChatRoom> {
    const { roomId } = JSON.parse(id);
    return this.chatRoomRepository.findOne({
      where: { chat_room_id: roomId },
    });
  }

  async findOrCreateRoom(createRoomDto: CreateRoomDto): Promise<ChatRoom> {
    const { user_id: userId, orphanage_user_id: orphanageUserId } =
      createRoomDto;
    // 두 사용자가 참여하는 대화방이 존재하는지 확인
    const user = await this.userRepository.findOne({
      where: { user_id: userId },
    });

    const orphanageUser = await this.orphanageUserRepository.findOne({
      where: { orphanage_user_id: orphanageUserId },
    });

    let room = await this.chatRoomRepository.findOne({
      where: { user, orphanage_user: orphanageUser },
    });

    if (!room) {
      // 존재하지 않으면 새 대화방 생성
      room = this.chatRoomRepository.create({
        chat_room_id: uuid.v4(),
        user,
        orphanage_user: orphanageUser,
      });
      await this.chatRoomRepository.save(room);
    }

    return room;
  }

  async sendMessage(sendMessageDto: string) {
    const {
      sender,
      type,
      join_room: room,
      content,
    } = JSON.parse(JSON.parse(sendMessageDto));
    console.log(JSON.parse(JSON.parse(sendMessageDto)));
    console.log(sender, type, room, content);
    const message = this.messageRepository.create({
      message_id: uuid.v4(),
      content,
      sender,
      type,
      join_room: room,
      isRead: false,
    });
    await this.messageRepository.save(message);
    return message;
  }

  async getMessages(room: string): Promise<Message[]> {
    return this.messageRepository.find({ where: { join_room: room } });
  }
}
