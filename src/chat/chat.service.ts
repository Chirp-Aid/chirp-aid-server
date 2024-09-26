import { InjectRepository } from '@nestjs/typeorm';
import { ChatRoom } from 'src/entities/chat-room.entity';
import { Message } from 'src/entities/message.entity';
import { Repository } from 'typeorm';
import { CreateRoomDto } from './dto/createRoom.dto';
import { SendMessageDto } from './dto/sendMessage.dto';

export class ChatService {
  constructor(
    @InjectRepository(ChatRoom)
    private chatRoomRepository: Repository<ChatRoom>,
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
  ) {}

  async findRoomById(id: string): Promise<ChatRoom> {
    return this.chatRoomRepository.findOne({
      where: { chat_room_id: id },
    });
  }

  async findOrCreateRoom(createRoomDto: CreateRoomDto): Promise<ChatRoom> {
    const { user, orphanage_user } = createRoomDto;
    // 두 사용자가 참여하는 대화방이 존재하는지 확인
    let room = await this.chatRoomRepository.findOne({
      where: { user, orphanage_user },
    });

    if (!room) {
      // 존재하지 않으면 새 대화방 생성
      room = this.chatRoomRepository.create({ user, orphanage_user });
      await this.chatRoomRepository.save(room);
    }

    return room;
  }

  async sendMessage(sendMessageDto: SendMessageDto) {
    const { sender, type, room, content } = sendMessageDto;

    const message = this.messageRepository.create({
      sender,
      type,
      room,
      content,
    });
    await this.messageRepository.save(message);
    return message;
  }

  async getMessages(room: ChatRoom): Promise<Message[]> {
    return this.messageRepository.find({ where: { room } });
  }
}
