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

  @Column({ nullable: true })
  target_id: string;

  @Column({ nullable: true })
  target_name?: string;

  @Column({ nullable: true })
  target_type?: string;

  @Column({ nullable: true })
  board_type?: string;

  @Column({ nullable: true })
  board_content?: string;
}
