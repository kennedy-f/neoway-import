export interface BaseData {
  cpf: string;
  private: boolean;
  incomplete: boolean;
  lastBuyDate: Date | null;
  mediumTicket: number;
  mediumTicketCents: number;
  latestBuyTicket: number;
  latestBuyTicketCents: number;
  mostFrequentlyShop: string;
  latestBuyStore: string;
}
