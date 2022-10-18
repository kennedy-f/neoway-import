import { RepoService } from '../../repository';
import { Store } from '../../models';

interface ShopInput {
  cnpj: string;
}

interface IShopService {
  create: (data: ShopInput) => Store;
  findByCnpj: (cnpj: string) => Promise<Store>;
  save: (data: Store) => Promise<Store>;
  saveAll: (data: Store[]) => Promise<Store[]>;
}

const storeMap = new Map<string, Store>();

export class StoreService implements IShopService {
  constructor(private repoService: RepoService) {}

  create(data: ShopInput): Store {
    return this.repoService.store.create(data);
  }

  async findByCnpj(cnpj: string): Promise<Store> {
    if (!cnpj) return null;

    if (!storeMap.has(cnpj)) {
      return this.repoService.store.findOne({ where: { cnpj: cnpj } });
    }
  }

  async saveAll(data: Store[]): Promise<Store[]> {
    const stores = await this.repoService.store.save(data);

    stores.forEach(store => {
      storeMap.set(store.cnpj, store);
    });

    return stores;
  }

  async save(data: Store): Promise<Store> {
    const store = this.findByCnpj(data.cnpj);

    if (!store) {
      const savedStore = await this.repoService.store.save(data);
      storeMap.set(savedStore.cnpj, savedStore);
      return savedStore;
    }

    return store;
  }
}
