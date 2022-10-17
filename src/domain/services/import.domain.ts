import { Store, User } from '../../models';

export interface ImportDefaultProps {
  header: number;
  columnNames: string[];
}

export interface IImportService {
  importLocalFile: (
    path: string,
    ImportDefaultProps: ImportDefaultProps,
  ) => Promise<boolean>;

  // importFromBuffer: (
  //   file: Buffer,
  //   ImportDefaultProps: ImportDefaultProps,
  // ) => Promise<Array<User>>;

  createStore: (storeCnpj: string) => Store;

  saveStore: (store: Store[]) => Promise<Store[]>;

  importStores: (
    storesObject: Record<string, Store>,
  ) => Promise<Record<string, Store>>;

  findOrCreateStore: (
    oldStores: Record<string, Store>,
    cnpj: string,
  ) => Promise<Store>;

  importBaseData: (file: Buffer) => Promise<boolean>;
}
