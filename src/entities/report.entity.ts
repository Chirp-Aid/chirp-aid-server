import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('report')
export class Report {
  @PrimaryGeneratedColumn()
  report_id: string;

  @Column()
  description: string;

  @Column()
  reporter_id: string;

  @Column()
  reporter_name: string;

  @Column()
  reporter_type: string;

  @Column()
  target_id: string;

  @Column()
  target_name: string;

  @Column()
  target_type: string;

  @Column()
  board_type: string;

  @Column()
  board_content: string;
}
