import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('message')
export class Message {
  @PrimaryColumn()
  message_id: string;

  @Column()
  sender: string;

  @Column()
  type: 'USER' | 'ORPHANAGE_USER';

  @Column()
  join_room: string;

  @Column()
  content: string;

  @Column({ default: false })
  isRead: boolean;
}
