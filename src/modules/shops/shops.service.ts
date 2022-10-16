import { Shop } from 'models';
import { RepoService } from '../../repository';

interface ShopInput {
  cnpj: string;
}

interface IShopService {
  create: (data: ShopInput) => Promise<Shop>;
}

export class ShopsService {
  constructor(private repoService: RepoService) {}
  async create(data: ShopInput) {
    const shop = this.repoService.shop.create(data);
    return this.repoService.shop.save(shop);
  }
}
