import { DataTestFileToObject, ReadTxtFile } from '../../utils';
import { Store } from '../../models';
import { RepoService } from '../../repository';
import { IImportService } from '../../domain/services';

const localFile = 'src/assets/files/base_teste.txt';
// const localFile = 'src/assets/files/base_teste copy.txt';

export class ImportService implements IImportService {
  constructor(private repoService: RepoService) {}

  async importLocalFile(): Promise<boolean> {
    const buffer = ReadTxtFile(localFile);
    return this.importBaseData(buffer);
  }

  createStore(storeCNPJ: string): Store {
    return this.repoService.shop.create({ cnpj: storeCNPJ });
  }
  importData;

  async saveStore(store: Store[]) {
    return this.repoService.shop.save(store);
  }

  async importStores(
    stores: Record<string, Store>,
  ): Promise<Record<string, Store>> {
    // Usando objeto para evitar mais loops e chamadas no banco
    // De inicio utilizei um array, mas para cada
    // user era feito um loop e ou uma busca no banco ou um novo loop para encontrar
    // a store, o que aumentava a complexidade
    // users * store
    // com objeto diminui para algo como 3 * O(n)
    const storesCnpjs = Object.keys(stores);
    const allStoresToSave = [];

    storesCnpjs.forEach(cnpj => {
      allStoresToSave.push(stores[cnpj]);
    });

    const savedStores = await this.repoService.shop.save(allStoresToSave);

    savedStores.forEach(store => {
      storesCnpjs[store.cnpj] = store;
    });
    return stores;
  }

  async findOrCreateStore(
    oldStores: Record<string, Store>,
    cnpj: string,
  ): Promise<Store> {
    if (cnpj) {
      if (oldStores[cnpj]) {
        return oldStores[cnpj];
      } else {
        return await this.repoService.shop.findOne({ where: { cnpj } });
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
              ? await this.findOrCreateStore(stores, importData?.lastBuyStore)
              : null;

        if (!latestBuyStore && importData?.lastBuyStore) {
          mostFrequentlyShop = await this.findOrCreateStore(
            stores,
            importData?.lastBuyStore,
          );
        }

        if (!mostFrequentlyShop && importData?.lastBuyStore) {
          latestBuyStore = await this.findOrCreateStore(
            stores,
            importData?.mostFrequentlyStore,
          );
        }

        const user = this.repoService.user.create({
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
    await this.repoService.user.save(users, { chunk: 100 });
    console.timeEnd('POPULATED DATABASE');

    return true;
  }
}
