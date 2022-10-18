import { DataTestFileToObject, ReadTxtFile } from '../../utils';
import { Store, Ticket } from '../../models';
import { IImportService } from '../../domain/services';
import { StoreService } from '../store';
import { UserService } from '../user';
import { TicketService } from '../ticket';

const localFile = process.env.FILE_TO_IMPORT;
// const localFile = 'src/assets/files/base_teste copy.txt';

export class ImportService implements IImportService {
  constructor(
    private storeService: StoreService,
    private userService: UserService,
    private ticketService: TicketService,
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
    console.time('READ FILE');
    const { data, stores: cnpjs } = DataTestFileToObject(file);

    const stores = cnpjs.map(cnpj => this.createStore(cnpj));

    console.timeEnd('READ FILE');

    console.time('IMPORT STORE');
    await this.storeService.saveAll(stores);
    console.timeEnd('IMPORT STORE');

    const users = [];
    const tickets = [];

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
          latestBuyStore = await this.storeService.findByCnpj(
            importData?.lastBuyStore,
          );
        }

        if (!mostFrequentlyShop && importData?.lastBuyStore) {
          mostFrequentlyShop = await this.storeService.findByCnpj(
            importData?.mostFrequentlyStore,
          );
        }

        const userTickets: Ticket[] = [];
        if (latestBuyStore) {
          const ticket = this.ticketService.create({
            store: latestBuyStore,
            value: importData?.lastBuyTicket[0],
            cents: importData?.lastBuyTicket[1],
            buyDate: importData?.lastBuyDate,
          });
          userTickets.push(ticket);
          tickets.push(ticket);
        }

        const user = this.userService.create({
          ...importData,
          mediumTicket: importData?.mediumTicket?.[0] || null,
          mediumTicketCents: importData?.mediumTicket?.[1] || null,
          tickets: userTickets,
          mostFrequentlyStore: mostFrequentlyShop ? mostFrequentlyShop : null,
        });

        users.push(user);
      } catch (err) {
        console.log('err', err);
        throw new Error(err);
      }
    }
    console.timeEnd('GET USERS');
    //
    // console.time('POPULATE TICKETS');
    // await this.userService.saveAll(users);
    // console.timeEnd('POPULATE TICKETS');

    console.time('POPULATED USERS DATABASE');
    await this.userService.saveAll(users);
    console.timeEnd('POPULATED USERS DATABASE');

    // console.time('POPULATE TICKETS');
    // await this.ticketService.saveAll(tickets);
    // console.timeEnd('POPULATE TICKETS');

    return true;
  }
}
