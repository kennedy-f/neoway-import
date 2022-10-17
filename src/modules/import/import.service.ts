import { DataTestFileToObject, ReadTxtFile } from '../../utils';
import { Store } from '../../models';
import { RepoService } from '../../repository';

const localFile = 'src/assets/files/base_teste.txt';
// const localFile = 'src/assets/files/base_teste copy.txt';

export class ImportService {
  constructor(private repoService: RepoService) {}

  async importLocalFile() {
    const buffer = ReadTxtFile(localFile);
    return this.importBaseData(buffer);
  }

  createStore(storeCNPJ: string): Store {
    return this.repoService.shop.create({ cnpj: storeCNPJ });
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
        let latestBuyStore = null;

        // TODO: refact this into a function
        if (importData?.lastBuyStore) {
          const latestBuyStoreCnpj = importData.lastBuyStore;
          if (stores[latestBuyStoreCnpj]) {
            latestBuyStore = stores[latestBuyStoreCnpj];
          } else {
            latestBuyStore = await this.repoService.shop.findOne({
              where: {
                cnpj: importData.lastBuyStore,
              },
            });

            if (!latestBuyStore) {
              latestBuyStore = await this.repoService.shop.save({
                cnpj: importData.lastBuyStore,
              });
            }
          }
        }

        let mostFrequentlyShop = null;

        // TODO: refact this into a function
        if (importData?.mostFrequentlyStore === importData?.lastBuyStore) {
          mostFrequentlyShop = latestBuyStore;
        } else if (importData?.mostFrequentlyStore) {
          const mostFrequentlyStoreCnpj = importData.mostFrequentlyStore;
          if (stores[mostFrequentlyStoreCnpj]) {
            mostFrequentlyShop = stores[mostFrequentlyStoreCnpj];
          } else {
            // tudo desnecessário para o teste,
            // apenas por boa pratica,
            // poder ser melhorado
            mostFrequentlyShop = await this.repoService.shop.findOne({
              where: {
                cnpj: importData.mostFrequentlyStore,
              },
            });
            if (!mostFrequentlyShop) {
              mostFrequentlyShop = this.repoService.shop.create({
                cnpj: importData.mostFrequentlyStore,
              });
            }
          }
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
