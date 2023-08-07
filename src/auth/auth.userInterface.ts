import { User } from '../entities/user.entity';

export interface IOAuthUser {
  user: Pick<User, 'email' | 'name' | 'password'>;
}
