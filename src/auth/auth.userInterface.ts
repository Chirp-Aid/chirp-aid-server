import { User } from 'src/members/entities/user.entity';

export interface IOAuthUser {
  user: Pick<User, 'email' | 'name' | 'password'>;
}
