import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('user')
export class User {
  @PrimaryColumn()
  userId?: string;

  @Column({ length: 15 })
  name: string;

  @Column({ unique: true, length: 60 })
  email: string;

  @Column({ length: 60 })
  password: string;

  @Column()
  age: number;

  @Column()
  sex: string;

  @Column({ unique: true, length: 15 })
  nickName: string;

  @Column()
  region: string;

  @Column({ length: 15 })
  phoneNumber: string;

  @Column()
  profilePhoto: string;

  @Column({ default: 'none' })
  refreshToken: string;

  @Column({ default: 'none' })
  fcmToken: string;
}
