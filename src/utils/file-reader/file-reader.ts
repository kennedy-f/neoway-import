import { readFileSync } from 'node:fs';
import {
  ImportDefaultTestDataNormalize,
  verifyCpf,
} from '../../validators/default-test/default-test-data.validator';
import { DefaultTestImport } from '../../domain/default-test';
import { BASE_TEST_COLUMNS } from '../../constants';

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

export function DataTestFileToObject(file: Buffer): {
  data: DefaultTestImport[];
  stores: string[];
} {
  const rows = BufferToArray(file);
  const headerNumber = 0;
  const columnsNames = BASE_TEST_COLUMNS();

  const storeSet = new Set<string>();

  const cpfIndex = columnsNames.findIndex(value => value === 'cpf');

  const data = rows.map((row, index) => {
    if (index === headerNumber) return;

    const rowObject: Record<string, any> = {};
    const rowColumns = breakInColumns(row, WhiteSpacesRegexBreaker);

    if (!verifyCpf(rowColumns[cpfIndex])) return rowObject as DefaultTestImport;

    columnsNames.forEach((colName, colNumber) => {
      if ('NULL' === rowColumns[colNumber]) rowObject[colName] = null;
      else {
        rowObject[colName] = ImportDefaultTestDataNormalize(
          rowColumns[colNumber],
        );

        if (['mostFrequentlyStore', 'lastBuyStore'].includes(colName)) {
          if (rowObject[colName]) {
            storeSet.add(rowObject[colName]);
          }
        }
      }
    });

    return rowObject as DefaultTestImport;
  });

  return { data, stores: [...storeSet.values()] };
}
