import { FileToObject, ReadTxtFile } from 'utils';
import { User } from 'models';
import {
  IImportService,
  ImportDefaultProps,
} from 'domain/services/import.domain';

const localFile = 'src/assets/files/base_teste.txt';

export class ImportService implements IImportService {
  importLocalFile(path: string, params: ImportDefaultProps) {
    const buffer = ReadTxtFile(localFile);
    const content = this.importFile(buffer, params.header, params.columnNames);

    return this.importData(content);
  }

  importFromBuffer(file: Buffer, params: ImportDefaultProps) {
    const content = this.importFile(file, params.header, params.columnNames);

    return this.importData(content);
  }

  importFile(file: Buffer, headerIndex = 0, columnsNames) {
    return FileToObject(file, headerIndex, columnsNames);
  }

  async importData(data: Array<Record<string, string>>): Promise<Array<User>> {
    return [];
  }
}
