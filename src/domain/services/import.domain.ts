import { User } from 'models';

export interface ImportDefaultProps {
  header: number;
  columnNames: string[];
}

export interface IImportService {
  importLocalFile: (
    path: string,
    ImportDefaultProps: ImportDefaultProps,
  ) => Promise<Array<User>>;

  importFromBuffer: (
    file: Buffer,
    ImportDefaultProps: ImportDefaultProps,
  ) => Promise<Array<User>>;

  importData: (data: Array<Record<string, string>>) => Promise<Array<User>>;
}
