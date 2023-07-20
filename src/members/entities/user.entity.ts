import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity('user')
export class User{
    @PrimaryColumn()
    user_id?: string;

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
    refresh_token: string;
    
    @Column({default: 'none'})
    fcm_token: string;
}