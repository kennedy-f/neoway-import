import { Store } from '../../models';

export interface ImportDefaultProps {
  header: number;
  columnNames: string[];
}

export interface IImportService {
  importLocalFile: (
    path: string,
    ImportDefaultProps: ImportDefaultProps,
  ) => Promise<boolean>;

  createStore: (storeCnpj: string) => Store;

  saveStore: (store: Store[]) => Promise<Store[]>;

  importStores: (store: Store[]) => Promise<Map<string, Store>>;

  findImportStore: (
    oldStores: Map<string, Store>,
    cnpj: string,
  ) => Promise<Store>;

  importBaseData: (file: Buffer) => Promise<boolean>;
}
