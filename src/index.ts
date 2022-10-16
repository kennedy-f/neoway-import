import { TypeormDataSource } from './config/db';
import { ImportService } from './modules/import';
import { RepoService } from './repository';
import { BASE_TEST_COLUMNS } from './constants';

const testData = {
  cpf: '866.315.609-00 ',
  private: '0',
  incomplete: '0',
  lastBuyDate: '2010-01-13',
  mediumTicket: '355,38',
  latestBuyTicket: '355,38',
  latestBuyStore: '79.379.491/0001-83',
  mostFrequentlyShop: '79.379.491/0001-83',
};

TypeormDataSource.initialize().then(() => {
  console.time('Init import');
  const data = new ImportService(new RepoService()).importLocalFile(
    'src/assets/files/base_teste.txt',
    {
      header: 0,
      columnNames: BASE_TEST_COLUMNS(),
    },
  );

  // const test = new ImportService(new RepoService()).importBaseData([testData]);
  console.timeEnd('Init import');
});
