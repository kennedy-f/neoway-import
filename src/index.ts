import { TypeormDataSource } from './config/db';
import { ImportService } from './modules/import';
import { RepoService } from './repository';
import { BASE_TEST_COLUMNS } from './constants';

// TypeormDataSource.initialize().then(database => {
//   database.query('DROP SCHEMA "public" CASCADE ; CREATE SCHEMA "public";');
// });

TypeormDataSource.initialize().then(() => {
  console.time('Init import');
  const data = new ImportService(new RepoService()).importLocalFile();

  // const test = new ImportService(new RepoService()).importBaseData([testData]);
  console.timeEnd('Init import');
});
