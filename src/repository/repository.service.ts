import { TypeormDataSource } from '../config/db';
import { Store, User } from '../models';

export class RepoService {
  store = TypeormDataSource.getRepository(Store);
  user = TypeormDataSource.getRepository(User);
}
