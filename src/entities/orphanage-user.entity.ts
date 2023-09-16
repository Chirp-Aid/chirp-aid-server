import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { Orphanage } from '../entities/orphanage.entity';

@Entity('orphanage_user')
export class OrphanageUser {
  @PrimaryColumn()
  orphanage_user_id: string;

  @Column({ length: 15 })
  name: string;

  @Column({ unique: true, length: 60 })
  email: string;

  @Column({ length: 60 })
  password: string;

  @Column({ nullable: true })
  refresh_token: string;

  @Column({ nullable: true })
  fcm_token: string;

  @OneToOne(() => Orphanage, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orphanage_id' })
  orphanag_id: Orphanage;
}
