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
}
