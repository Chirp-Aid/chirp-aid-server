import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('User')
export class User{
    @PrimaryGeneratedColumn()
    user_id?: number;

    @Column({ length: 15})
    name: string;

    @Column({ unique: true, length: 60})
    email: string;

    @Column({ length: 60})
    password: string;

    @Column()
    age: number;

    @Column()
    sex: string;

    @Column({ unique: true, length: 15})
    nickname: string;

    @Column()
    region: string;

    @Column({ length: 15 })
    phone_number: string;

    @Column()
    profile_photo: string;

    @Column({default: 'none'})
    refresh_token?: string;
}