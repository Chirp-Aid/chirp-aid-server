import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Orphanage } from './orphanage.entity';

@Entity()
export class Reservation {
  @PrimaryGeneratedColumn({ name: 'reservation_id' })
  reservationId: number;

  @Column({ name: 'write_date' })
  writeDate: string;

  @Column({ name: 'visit_date' })
  visitDate: string;

  @Column()
  reason: string;

  @Column({ length: 30, default: 'PENDING' }) //APPROVED(승인됨), REJECTED(거절됨), PENDING(대기 중), COMPLETED(완료))
  state: string;

  @Column({ default: null, name: 'reject_reason' })
  rejectReason?: string;

  @ManyToOne(() => User, { onDelete: 'NO ACTION' })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'user_id' }])
  user: User;

  @ManyToOne(() => Orphanage, { onDelete: 'NO ACTION' })
  @JoinColumn([{ name: 'orphanage_id', referencedColumnName: 'orphanage_id' }])
  orphanage: Orphanage;
}
