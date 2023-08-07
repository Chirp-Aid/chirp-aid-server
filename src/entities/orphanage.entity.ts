import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
