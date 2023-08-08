import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { OrphanageUser } from './orphanage-user.entity';
import { Product } from './product.entity';

@Entity('request')
export class Request {
    @PrimaryGeneratedColumn()
    request_id: number;

    @Column()
    count: number

    @Column()
    state: string;

    @Column({ length: 150 })
    message: string;

    @ManyToOne(() => OrphanageUser, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'orphanage_user_id'})
    orphanage_user_id: OrphanageUser;

    @OneToOne(()=> Product, (product_id)=>product_id.product_id)
    @JoinColumn({ name: 'product_id'})
    product_id: Product
}
