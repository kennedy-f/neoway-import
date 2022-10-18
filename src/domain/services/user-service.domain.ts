import { User } from '../../models';

export type CreateUserInput = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;

export interface IUserService {
  create: (user: CreateUserInput) => User;
  save: (user: User) => Promise<User>;
  saveAll: (user: User[]) => Promise<User[]>;
  saveAll2: (user: User[]) => any;
}
