import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { ChatRoom } from './chat-room.entity';

@Entity('message')
export class Message {
  @PrimaryGeneratedColumn()
  message_id: string;

  @Column()
  content: string;

  @Column()
  sender: string;

  @Column()
  type: 'USER' | 'ORPHANAGE_USER';

  @ManyToOne(() => ChatRoom, { onDelete: 'CASCADE' })
  room: ChatRoom;

  @Column({ default: false })
  isRead: boolean;
}
