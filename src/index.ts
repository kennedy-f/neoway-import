import { TypeormDataSource } from './config/db';
import { ImportService } from './modules/import';
import { RepoService } from './repository';

TypeormDataSource.initialize().then(() => {
  new ImportService(new RepoService()).importLocalFile();
});
