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

export class StoreService implements IShopService {
  constructor(private repoService: RepoService) {}

  create(data: ShopInput): Store {
    return this.repoService.store.create(data);
  }

  async findByCnpj(cnpj: string): Promise<Store> {
    return this.repoService.store.findOne({ where: { cnpj: cnpj } });
  }

  async saveAll(data: Store[]): Promise<Store[]> {
    return this.repoService.store.save(data);
  }

  async save(data: Store): Promise<Store> {
    const store = this.findByCnpj(data.cnpj);

    if (!store) {
      return this.repoService.store.save(data);
    }

    return store;
  }
}
