import { FileToObject, ReadTxtFile } from '../../utils';
import { User } from '../../models';
import { ImportDefaultProps } from '../../domain/services';
import { RepoService } from '../../repository';
import { ImportDefaultTestData } from '../../validators/default-test/default-test-data.validator';

const localFile = 'src/assets/files/base_teste.txt';

export class ImportService {
  constructor(private repoService: RepoService) {}

  async importLocalFile(path: string, params: ImportDefaultProps) {
    const buffer = ReadTxtFile(localFile);
    const content = this.importFile(buffer, params.header, params.columnNames);

    return this.importBaseData(content);
  }

  importFromBuffer(file: Buffer, params: ImportDefaultProps) {
    const content = this.importFile(file, params.header, params.columnNames);

    return this.importBaseData(content);
  }

  importFile(file: Buffer, headerIndex = 0, columnsNames) {
    return FileToObject(file, headerIndex, columnsNames);
  }

  async importBaseData(
    data: Array<Record<string, string>>,
  ): Promise<Array<User>> {
    const users = [];
    for (const dataRow of data) {
      try {
        const importData = ImportDefaultTestData(dataRow);

        let latestBuyStore = null;
        if (importData?.latestBuyStore) {
          latestBuyStore = await this.repoService.shop.findOne({
            where: {
              cnpj: importData.latestBuyStore,
            },
          });

          if (!latestBuyStore) {
            latestBuyStore = await this.repoService.shop.save({
              cnpj: importData.latestBuyStore,
            });
          }
        }

        let mostFrequentlyShop = null;
        if (importData?.mostFrequentlyShop === importData?.latestBuyStore) {
          mostFrequentlyShop = latestBuyStore;
        } else if (importData?.mostFrequentlyShop) {
          mostFrequentlyShop = await this.repoService.shop.findOne({
            where: {
              cnpj: importData.mostFrequentlyShop,
            },
          });
          if (!mostFrequentlyShop) {
            mostFrequentlyShop = this.repoService.shop.create({
              cnpj: importData.mostFrequentlyShop,
            });
          }
        }

        const user = this.repoService.user.create({
          ...importData,
          lastBuyTicketCents: importData?.latestBuyTicketCents,
          lastBuyTicket: importData?.latestBuyTicket,
          lastBuyStore: latestBuyStore,
          mostFrequentlyStore: mostFrequentlyShop,
        });
        users.push(user);
      } catch (err) {
        console.log(err);
      }
    }
    console.time('INIT POPULATING DATABASE');
    const savedData = await this.repoService.user.save(users);
    console.timeEnd('INIT POPULATING DATABASE');
    return savedData;
  }
}
