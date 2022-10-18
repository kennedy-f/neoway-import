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

  async importStores(stores: Store[]): Promise<Map<string, Store>> {
    // Usando objeto para evitar mais loops e chamadas no banco
    // no começo utilizei um array, mas para cada
    // user era feito um loop e/ou uma busca no banco, ou um novo loop para encontrar
    // a store, o que aumentava a complexidade ou o tempo de resposta até a busca
    // ser concluída (atualmente só vi duas stores?)
    // com objeto a complexidade diminui e muito
    const savedStores = await this.storeService.saveAll(stores);

    const mapStore = new Map<string, Store>();

    savedStores.forEach(store => {
      mapStore.set(store.cnpj, store);
    });

    return mapStore;
  }

  async findImportStore(
    storeMap: Map<string, Store>,
    cnpj: string,
  ): Promise<Store> {
    if (!cnpj) return null;

    return storeMap.get(cnpj) || this.storeService.findByCnpj(cnpj);
  }

  async importBaseData(file: Buffer) {
    console.time('TÁ GRANDE');
    const { data, stores: cnpjs } = DataTestFileToObject(file);

    const stores = cnpjs.map(cnpj => this.createStore(cnpj));

    console.timeEnd('TÁ GRANDE');

    console.time('IMPORT STORE');
    await this.storeService.saveAll(stores);
    console.timeEnd('IMPORT STORE');

    const users = [];

    console.time('GET USERS');
    for (const importData of data) {
      try {
        if (!importData?.cpf) continue;

        let latestBuyStore,
          mostFrequentlyShop =
            importData?.lastBuyStore === importData?.mostFrequentlyStore
              ? await this.storeService.findByCnpj(importData?.lastBuyStore)
              : null;

        if (!latestBuyStore && importData?.lastBuyStore) {
          mostFrequentlyShop = await this.storeService.findByCnpj(
            importData?.lastBuyStore,
          );
        }

        if (!mostFrequentlyShop && importData?.lastBuyStore) {
          latestBuyStore = await this.storeService.findByCnpj(
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
        console.log('err', err);
        throw new Error(err);
      }
    }
    console.timeEnd('GET USERS');

    console.time('POPULATED DATABASE');
    await this.userService.saveAll2(users);
    console.timeEnd('POPULATED DATABASE');

    return true;
  }
}
