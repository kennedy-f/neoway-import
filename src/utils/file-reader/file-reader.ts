import { readFileSync } from 'node:fs';

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

export function FileToObject(
  file: Buffer,
  headerNumber = 0,
  columnsNames?: Array<string>,
) {
  const arrayBreakLines = BufferToArray(file);

  if (!columnsNames) {
    columnsNames = breakInColumns(
      arrayBreakLines[headerNumber],
      WhiteSpacesRegexBreaker,
    );
  }

  return arrayBreakLines.map((row, index) => {
    if (index === headerNumber) return;

    const rowObject: Record<string, any> = {};
    const rowColumns = breakInColumns(row, WhiteSpacesRegexBreaker);

    columnsNames.forEach((colName, colNumber) => {
      if (['NULL'].includes(rowColumns[colNumber])) rowObject[colName] = null;
      else rowObject[colName] = rowColumns[colNumber];
    });

    return rowObject;
  });
}
