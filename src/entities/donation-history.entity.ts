import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Request } from "./request.entity";
import { User } from "./user.entity";

@Entity('donation_history')
export class DonationHistory{
    @PrimaryGeneratedColumn()
    donation_history_id: number;

    @Column()
    date: string;

    @Column()
    count: number;

    @Column()
    message: string;

    @ManyToOne( ()=> Request,{ onDelete: 'NO ACTION' } )
    @JoinColumn([{name: 'request_id', referencedColumnName: 'request_id'}])
    request_id: Request;

    @ManyToOne( () => User, {onDelete: 'CASCADE'} )
    @JoinColumn([{name: 'user_id', referencedColumnName: 'user_id'}])
    user_id: User;
}