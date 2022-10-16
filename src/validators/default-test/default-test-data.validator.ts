import { BaseData } from '../../domain/default-test';
import { RemoveSymbols, validateCNPJ, validateCPF } from '../fields';
import { format, isValid } from 'date-fns';

const verifyCpf = (cpf: string, ref?: Record<string, any> | any) => {
  const cleanCpf = RemoveSymbols(cpf);
  if (validateCPF(cleanCpf)) {
    return cleanCpf;
  }
  // console.error('Invalid CPF format', ref);
  return null;
};

const verifyStore = (cnpj: string, ref?: Record<string, any> | any): string => {
  if (!cnpj) return null;

  const cleanCnpj = RemoveSymbols(cnpj);

  if (validateCNPJ(cleanCnpj)) {
    return cleanCnpj;
  }

  // console.error('INVALID CNPJ FORMAT', ref);
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
    return [Number(values[0]), Number(values[1])];
  }
  return [null, null];
};

export const ImportDefaultTestData = (data: Record<string, any>): BaseData => {
  if (data) {
    if (data?.cpf) {
      const cpf = verifyCpf(data.cpf);
      if (!cpf) {
        return null;
        // throw new Error('Invalid CPF');
      }

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
        latestBuyStore: verifyStore(data?.latestBuyStore),
        mostFrequentlyShop: verifyStore(data?.mostFrequentlyShop),
        latestBuyTicket: latestBuyTicketValues[0],
        latestBuyTicketCents: latestBuyTicketValues[1],
        mediumTicket: mediumTicketValues[0],
        mediumTicketCents: mediumTicketValues[1],
      };
    }
  }

  return null;
  // throw new Error('No data');
};
