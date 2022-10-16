export const BASE_TEST_COLUM_NAMES = [
  'CPF',
  'PRIVATE',
  'INCOMPLETO',
  'DATA DA ÚLTIMA COMPRA',
  'TICKET MÉDIO',
  'TICKET DA ÚLTIMA COMPRA',
  'LOJA MAIS FREQUÊNTE',
  'LOJA DA ÚLTIMA COMPRA',
];

export const BaseTestColumnsNormalizeNames = {
  CPF: 'cpf',
  PRIVATE: 'private',
  INCOMPLETO: 'incomplete',
  'DATA DA ÚLTIMA COMPRA': 'lastBuyDate',
  'TICKET MÉDIO': 'mediumTicket',
  'TICKET DA ÚLTIMA COMPRA': 'lastBuyTicket',
  'LOJA MAIS FREQUÊNTE': 'mostFrequentlyShop',
  'LOJA DA ÚLTIMA COMPRA': 'lastBuyShop',
};

export const BASE_TEST_COLUMNS = (): Array<string> => {
  return BASE_TEST_COLUM_NAMES.map(
    columnName => BaseTestColumnsNormalizeNames[columnName],
  );
};
