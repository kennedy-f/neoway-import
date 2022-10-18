import { Store, Ticket, User } from '../../models';
import { RepoService } from '../../repository';

interface TicketInput {
  buyDate: Date;
  value: number;
  cents: number;
  store: Store;
}

export class TicketService {
  constructor(private readonly repoService: RepoService) {}

  create(ticket: TicketInput) {
    const { store, value, cents, buyDate } = ticket;
    return this.repoService.ticket.create({
      store,
      ticketDate: buyDate,
      value,
      cents,
      currency: 'BRL',
    });
  }

  save(ticket: Ticket): Promise<Ticket> {
    return this.repoService.ticket.save(ticket);
  }

  saveAll(ticket: Ticket[]): Promise<Ticket[]> {
    return this.repoService.ticket.save(ticket);
  }

  formatDate(date?: Date): string {
    if (!date) return 'NULL';
    return `'${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}'`;
  }

  private getTicketParams(ticket: Ticket) {
    const { ticketDate, currency, store, value, cents, user } = ticket;
    return `(${user.id}, ${
      store.id
    }, '${currency}', ${value}, ${cents}, ${this.formatDate(ticketDate)} )`;
  }

  async saveTicketsWithUserIDs(users: User[], tickets: Map<string, Ticket[]>) {
    let params = ``;

    for (let i = 0; i < users.length; i++) {
      const ticket = tickets.get(users[i].cpf);
      if (ticket?.length > 0) {
        if (params.length > 0) {
          params += ', ';
        }
        params += this.getTicketParams({ ...ticket[0], user: users[i] });
      }
    }

    const query = `
    INSERT INTO "tickets" ("userId", "storeId", "currency", "value", "cents", "ticketDate")
    values ${params} `;

    return await this.repoService.ticket.query(query);
  }
}
