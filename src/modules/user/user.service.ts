import { RepoService } from '../../repository';
import { User } from '../../models';
import {
  CreateUserInput,
  IUserService,
} from '../../domain/services/user-service.domain';

// Metodos simples utilizando apenas o ORM
// encapsulo os metodos do orm para
// facilitar uma possivel necessidade de troca
// de ORM/LIB
export class UserService implements IUserService {
  constructor(private repoService: RepoService) {}

  create(userData: CreateUserInput) {
    return this.repoService.user.create(userData);
  }

  async save(user: User) {
    return this.repoService.user.save(user);
  }

  async saveAll(users: User[]) {
    if (users.length > 5000) {
      return this.repoService.user.save(users, { chunk: 100 });
    }
    return this.repoService.user.save(users);
  }
}
