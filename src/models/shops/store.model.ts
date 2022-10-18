import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Ticket } from '../ticket';
import { User } from '../user';

@Entity('store')
export class Store {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  cnpj: string;

  @OneToMany(() => User, ({ lastBuyStore }) => lastBuyStore)
  latestBuyStore: User[];

  @OneToMany(() => User, ({ mostFrequentlyStore }) => mostFrequentlyStore)
  mostFrequentlyStore: User[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Ticket, ({ store }) => store)
  tickets: Ticket[];
}
