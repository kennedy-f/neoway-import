import { readFileSync } from 'node:fs';
import {
  ImportDefaultTestDataNormalize,
  verifyCpf,
  verifyStore,
} from '../../validators/default-test/default-test-data.validator';
import { BaseData } from '../../domain/default-test';
import { BASE_TEST_COLUMNS } from '../../constants';
import { Store, User } from '../../models';
import { validateCNPJ } from '../../validators';

export function ReadTxtFile(path: string) {
  return readFileSync(path);
}

export function BufferToArray(file: Buffer) {
  const fileStrings = file.toString('utf-8');
  // Toda quebra de linha separa um novo item no array.
  return fileStrings.split(/\r?\n/); // Retornando direto sempre sem salvar em uma variavel.
}

export function breakInColumns(text: string, breaker: string | RegExp) {
  return text.split(breaker);
}

const WhiteSpacesRegexBreaker = /\s{2,}/;

interface DataTestFileToObjectReturn {
  users: User[];
  stores: Record<string, Store>[];
}

export function DataTestFileToObject(
  file: Buffer,
  store: (data: any) => any,
): BaseData[] {
  const arrayBreakLines = BufferToArray(file);
  const headerNumber = 0;
  const columnsNames = BASE_TEST_COLUMNS();

  return arrayBreakLines.map((row, index) => {
    if (index === headerNumber) return;

    const rowObject: Record<string, any> = {};
    const rowColumns = breakInColumns(row, WhiteSpacesRegexBreaker);
    const cpfIndex = columnsNames.findIndex(value => value === 'cpf');

    if (verifyCpf(rowColumns[cpfIndex])) {
      columnsNames.forEach((colName, colNumber) => {
        if (['NULL'].includes(rowColumns[colNumber])) rowObject[colName] = null;
        else {
          rowObject[colName] = ImportDefaultTestDataNormalize(
            rowColumns[colNumber],
          );

          if (['mostFrequentlyStore', 'lastBuyStore'].includes(colName)) {
            if (rowObject[colName]) {
              store(rowObject[colName]);
            }
          }
        }
      });
    }

    return rowObject as BaseData;
  });
}
