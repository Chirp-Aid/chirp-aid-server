import { User } from '../entities/user.entity';

export interface IOAuthUser {
  user: Pick<User, 'user_id' | 'email' | 'name' | 'password'>;
}
