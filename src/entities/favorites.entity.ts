import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Orphanage } from './orphanage.entity';
import { User } from './user.entity';

@Entity('favorites')
export class Favorites {
  @PrimaryGeneratedColumn()
  favorite_id: number;

  @ManyToOne(() => Orphanage, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orphanage_id' })
  orphanage_id: Orphanage;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user_id: User;
}
