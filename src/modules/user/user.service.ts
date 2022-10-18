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

  // ${this.formatDate(lastBuyDate)}

  private getUserParams(user: User): string {
    const {
      cpf,
      mediumTicket = 'NULL',
      mediumTicketCents = 'NULL',
      mostFrequentlyStore = { id: 'NULL' },
      incomplete = false,
    } = user;
    return (
      `(${cpf},  ${mediumTicket}, ` +
      `${mediumTicketCents}, ` +
      `${mostFrequentlyStore?.id || 'NULL'}, ${incomplete}, ${user.private})`
    );
  }

  formatDate(date?: Date): string {
    if (!date) return 'NULL';
    return `'${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}'`;
  }

  async saveAll2(users: User[]) {
    let params = ``;

    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      params += this.getUserParams(user);
      if (i !== users.length - 1) {
        params += ', ';
      }
    }

    const query = `
        INSERT INTO "user" ("cpf", "mediumTicket", "mediumTicketCents", "mostFrequentlyStoreId", "incomplete", "private")
        VALUES ${params}`;

    const res = await this.repoService.user.query(query);
  }
}
