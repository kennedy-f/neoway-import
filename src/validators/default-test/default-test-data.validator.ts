import { RemoveSymbols, validateCNPJ, validateCPF } from '../fields';

export const verifyCpf = (cpf: string, ref?: Record<string, any> | any) => {
  const cleanCpf = RemoveSymbols(cpf);
  if (validateCPF(cleanCpf)) {
    return cleanCpf;
  }
  return null;
};

export const verifyStore = (
  cnpj: string,
  ref?: Record<string, any> | any,
): string => {
  if (!cnpj) return null;

  const cleanCnpj = RemoveSymbols(cnpj);

  if (validateCNPJ(cleanCnpj)) {
    return cleanCnpj;
  }

  return null;
};

const verifyIsBoolean = (data: string): boolean | null => {
  if (data === '0' || data === '1') return !!data;
  return null;
};

const splitCurrencyValue = (
  value: number | string | null | undefined,
  ref?: Record<string, any> | any,
): number[] | null[] => {
  if (!value) {
    return [null, null];
  }

  if (typeof value === 'string') {
    const values = String(value).split(',');
    if (isNaN(Number(values[1]))) return null;
    return [Number(values[0]), Number(values[1])];
  }
  return [null, null];
};

export const ImportDefaultTestDataNormalize = (
  data: string | undefined | null,
): string | Array<number> | boolean | Date => {
  if (data && data !== 'null') {
    const isCpf = verifyCpf(data);
    if (isCpf) {
      return isCpf;
    }

    const isStore = verifyStore(data);
    if (isStore) {
      return isStore;
    }

    const isCurrency = splitCurrencyValue(data);
    if (isCurrency && !isNaN(isCurrency[1])) {
      return isCurrency;
    }

    const isBoolean = verifyIsBoolean(data);
    if (isBoolean) {
      return isBoolean;
    }

    const isDate = new Date(data);
    if (isDate) {
      return isDate;
    }
  }

  return null;
};
