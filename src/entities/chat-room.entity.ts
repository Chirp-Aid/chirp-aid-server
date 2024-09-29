import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from './user.entity';
import { OrphanageUser } from './orphanage-user.entity';

@Entity('chat_room')
export class ChatRoom {
  @PrimaryColumn()
  chat_room_id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn([{ name: 'user', referencedColumnName: 'user_id' }])
  user: User;

  @ManyToOne(() => OrphanageUser, { onDelete: 'CASCADE' })
  @JoinColumn([
    { name: 'orphanage_user', referencedColumnName: 'orphanage_user_id' },
  ])
  orphanage_user: OrphanageUser;
}
