import { DataTestFileToObject, ReadTxtFile } from '../../utils';
import { Store } from '../../models';
import { IImportService } from '../../domain/services';
import { StoreService } from '../store';
import { UserService } from '../user';

const localFile = 'src/assets/files/base_teste.txt';
// const localFile = 'src/assets/files/base_teste copy.txt';

export class ImportService implements IImportService {
  constructor(
    private storeService: StoreService,
    private userService: UserService,
  ) {}

  async importLocalFile(): Promise<boolean> {
    const buffer = ReadTxtFile(localFile);
    return this.importBaseData(buffer);
  }

  createStore(storeCNPJ: string): Store {
    return this.storeService.create({ cnpj: storeCNPJ });
  }

  async saveStore(store: Store[]) {
    return this.storeService.saveAll(store);
  }

  async importStores(
    stores: Record<string, Store>,
  ): Promise<Record<string, Store>> {
    // Usando objeto para evitar mais loops e chamadas no banco
    // no começo utilizei um array, mas para cada
    // user era feito um loop e/ou uma busca no banco, ou um novo loop para encontrar
    // a store, o que aumentava a complexidade ou o tempo de resposta até a busca
    // ser concluida (atualmente só vi duas stores?)
    // com objeto a complexidade diminui e muito
    const storesCnpjs = Object.keys(stores);
    const allStoresToSave = [];

    storesCnpjs.forEach(cnpj => {
      allStoresToSave.push(stores[cnpj]);
    });

    const savedStores = await this.storeService.saveAll(allStoresToSave);

    savedStores.forEach(store => {
      storesCnpjs[store.cnpj] = store;
    });
    return stores;
  }

  async findImportStore(
    importStores: Record<string, Store>,
    cnpj: string,
  ): Promise<Store> {
    if (cnpj) {
      if (importStores[cnpj]) {
        return importStores[cnpj];
      } else {
        return await this.storeService.findByCnpj(cnpj);
      }
    }
  }

  async importBaseData(file: Buffer) {
    let stores: Record<string, Store> = {};

    const data = DataTestFileToObject(file, async store => {
      stores[store] = this.createStore(store);
    });

    console.time('IMPORT STORE');
    stores = await this.importStores(stores);
    console.timeEnd('IMPORT STORE');

    const users = [];

    for (const importData of data) {
      try {
        if (!importData?.cpf) continue;
        let latestBuyStore,
          mostFrequentlyShop =
            importData?.lastBuyStore === importData?.mostFrequentlyStore
              ? await this.findImportStore(stores, importData?.lastBuyStore)
              : null;

        if (!latestBuyStore && importData?.lastBuyStore) {
          mostFrequentlyShop = await this.findImportStore(
            stores,
            importData?.lastBuyStore,
          );
        }

        if (!mostFrequentlyShop && importData?.lastBuyStore) {
          latestBuyStore = await this.findImportStore(
            stores,
            importData?.mostFrequentlyStore,
          );
        }

        const user = this.userService.create({
          ...importData,
          lastBuyTicket: importData?.lastBuyTicket?.[0] || null,
          lastBuyTicketCents: importData?.lastBuyTicket?.[1] || null,
          mediumTicket: importData?.mediumTicket?.[0] || null,
          mediumTicketCents: importData?.mediumTicket?.[1] || null,
          lastBuyStore: latestBuyStore ? latestBuyStore : null,
          mostFrequentlyStore: mostFrequentlyShop ? mostFrequentlyShop : null,
        });

        users.push(user);
      } catch (err) {
        throw new Error(err);
      }
    }

    console.time('POPULATED DATABASE');
    await this.userService.saveAll(users);
    console.timeEnd('POPULATED DATABASE');

    return true;
  }
}
