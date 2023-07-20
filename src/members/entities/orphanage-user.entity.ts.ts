import { Column, Entity } from "typeorm";

@Entity('orphanager_user')
export class OrphanageUser{
    @Column({ length: 15})
    name: string;

    @Column({ unique: true, length: 60})
    email: string;

    @Column({ length: 60})
    password: string;
}