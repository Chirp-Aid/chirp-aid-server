import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrphanageUser } from './orphanage-user.entity';

@Entity('review')
export class Review {
  @PrimaryGeneratedColumn()
  review_id: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column()
  photo?: string;

  @Column()
  date: string;

  @ManyToOne(() => OrphanageUser, { onDelete: 'CASCADE' })
  @JoinColumn([
    { name: 'orphanage_user', referencedColumnName: 'orphanage_user_id' },
  ])
  orphanage_user: OrphanageUser;
}
