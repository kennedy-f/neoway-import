import { DefaultTestImport } from '../../domain/default-test';
import { RemoveSymbols, validateCNPJ, validateCPF } from '../fields';
import { isValid } from 'date-fns';

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

export const ImportDefaultTestData = (
  data: Record<string, any>,
): DefaultTestImport => {
  if (data) {
    if (data?.cpf) {
      const cpf = verifyCpf(data.cpf);
      if (!cpf) return null;

      let lastBuyDate: Date | null = null;
      if (data?.lastBuyDate && isValid(new Date(data.lastBuyDate))) {
        lastBuyDate = new Date(data.lastBuyDate);
      }

      const latestBuyTicketValues = splitCurrencyValue(data?.latestBuyTicket);
      const mediumTicketValues = splitCurrencyValue(data?.mediumTicket);
      return {
        cpf: cpf,
        incomplete: data?.incomplete ? data.incomplete : null,
        private: data?.private ? data.private : null,
        lastBuyDate,
        lastBuyStore: verifyStore(data?.latestBuyStore),
        mostFrequentlyStore: verifyStore(data?.mostFrequentlyShop),
        lastBuyTicket: latestBuyTicketValues[0],
        mediumTicket: mediumTicketValues[0],
      };
    }
  }

  return null;
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
