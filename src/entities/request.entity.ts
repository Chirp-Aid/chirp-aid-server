import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrphanageUser } from './orphanage-user.entity';
import { Product } from './product.entity';
import { User } from './user.entity';

@Entity('request')
export class Request {
  @PrimaryGeneratedColumn()
  request_id: number;

  @Column()
  count: number;

  @Column({ default: 0 })
  supported_count: number;

  @Column({ default: 'REQUESTED' })
  state: string;

  @Column({ length: 150 })
  message: string;

  @ManyToOne(() => OrphanageUser, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orphanage_user_id' })
  orphanage_user_id: OrphanageUser;

  @ManyToOne(() => Product, (product_id) => product_id.product_id)
  @JoinColumn({ name: 'product_id' })
  product_id: Product;

  // @ManyToMany(() => User, {onDelete: 'NO ACTION'})
  // @JoinTable({ 
  //   name: 'basket_product_request',
  //   joinColumn: { name: 'request_id', referencedColumnName: 'request_id' },
  //   inverseJoinColumn: { name: 'user_id', referencedColumnName: 'user_id' }
  // })
  // users?: User[];
}
