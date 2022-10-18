import { TypeormDataSource } from '../config/db';
import { Store, User, Ticket } from '../models';

export class RepoService {
  store = TypeormDataSource.getRepository(Store);
  user = TypeormDataSource.getRepository(User);
  ticket = TypeormDataSource.getRepository(Ticket);
}
