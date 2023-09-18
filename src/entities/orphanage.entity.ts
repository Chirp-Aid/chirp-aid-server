import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { OrphanageUser } from './orphanage-user.entity';

@Entity('orphanage')
export class Orphanage {
  @PrimaryGeneratedColumn()
  orphanage_id: number;

  @Column({ unique: true })
  orphanage_name: string;

  @Column()
  address: string;

  @Column()
  homepage_link: string;

  @Column()
  phone_number: string;

  @Column()
  description: string;

  @Column()
  photo: string;

  @OneToOne(() => OrphanageUser, user => user.orphanage_id)
  user: OrphanageUser;
}
