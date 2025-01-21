import { InjectRepository } from '@nestjs/typeorm';
import { ChatRoom } from 'src/entities/chat-room.entity';
import { Message } from 'src/entities/message.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateRoomDto } from './dto/createRoom.dto';
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
    private dataSource: DataSource,
  ) {}

  async findRoomById(id: string): Promise<ChatRoom> {
    return this.chatRoomRepository.findOne({
      where: { chat_room_id: id },
    });
  }

  async findOrCreateRoom(createRoomDto: CreateRoomDto): Promise<ChatRoom> {
    const { user_id: userId, orphanage_user_id: orphanageUserId } = JSON.parse(
      createRoomDto.toString(),
    );
    // 두 사용자가 참여하는 대화방이 존재하는지 확인
    const user = await this.userRepository.findOne({
      where: { user_id: userId },
    });
    console.log(user);

    const orphanageUser = await this.orphanageUserRepository.findOne({
      where: { orphanage_user_id: orphanageUserId },
    });
    console.log(orphanageUser);

    let room = await this.chatRoomRepository.findOne({
      where: { user, orphanage_user: orphanageUser },
    });

    if (!room) {
      // 존재하지 않으면 새 대화방 생성
      room = this.chatRoomRepository.create({
        chat_room_id: uuid.v4(),
        user,
        orphanage_user: orphanageUser,
        created_at: new Date(),
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
    const message = this.messageRepository.create({
      message_id: uuid.v4(),
      content,
      sender,
      type,
      join_room: room,
      isRead: false,
      created_at: new Date(),
    });
    await this.messageRepository.save(message);
    return message;
  }

  async getMessages(room: string): Promise<Message[]> {
    const queryRunner = this.dataSource.createQueryRunner();
    console.log(room);

    queryRunner.connect();
    queryRunner.startTransaction();

    try {
      await this.messageRepository.update(
        { join_room: room },
        { isRead: true },
      );
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log(error['response']);
      throw error;
    } finally {
      await queryRunner.release();
    }
    return this.messageRepository.find({ where: { join_room: room } });
  }
}
