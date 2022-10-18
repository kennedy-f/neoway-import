import { Store, Ticket, User } from '../../models';
import { RepoService } from '../../repository';

interface TicketInput {
  buyDate: Date;
  value: number[];
  store: Store;
  user: User;
}

export class TicketService {
  constructor(private readonly repoService: RepoService) {}

  create(ticket: TicketInput) {
    const { user, store, value, buyDate } = ticket;
    return this.repoService.ticket.create({
      user,
      store,
      ticketDate: buyDate,
      value: value[0],
      valueCents: value[1],
    });
  }

  save(ticket: Ticket): Promise<Ticket> {
    return this.repoService.ticket.save(ticket);
  }

  saveAll(ticket: Ticket[]): Promise<Ticket[]> {
    return this.repoService.ticket.save(ticket);
  }
}
