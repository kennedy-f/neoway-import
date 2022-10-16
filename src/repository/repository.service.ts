import { TypeormDataSource } from '../config/db';
import { Store, User } from '../models';

export class RepoService {
  shop = TypeormDataSource.getRepository(Store);
  user = TypeormDataSource.getRepository(User);
}
