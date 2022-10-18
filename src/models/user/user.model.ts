import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Ticket } from '../ticket';
import { Store } from '../shops';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  cpf: string;

  @Column({ default: false, nullable: true })
  private: boolean;

  @Column({ default: false, nullable: true })
  incomplete: boolean;

  @Column({ nullable: true })
  lastBuyDate: Date | null;

  @Column({ nullable: true })
  mediumTicket: number;

  @Column({ nullable: true })
  mediumTicketCents: number;

  @Column({ nullable: true })
  lastBuyTicket: number;

  // Por experiencia eu prefiro manter os
  // valores separados, pois diferentes
  // linguagens interpretam valores
  // type decimal | float | money
  // de formas diferentes
  @Column({ nullable: true })
  lastBuyTicketCents: number;

  @Column({ nullable: true })
  lastBuyStoreId?: number;

  @Column({ nullable: true })
  mostFrequentlyStoreId?: number;

  @ManyToOne(() => Store, ({ latestBuyStore }) => latestBuyStore, {
    eager: false,
    cascade: ['insert', 'update'],
  })
  @JoinColumn({
    name: 'lastBuyStoreId',
  })
  lastBuyStore: Store;

  @ManyToOne(() => Store, ({ mostFrequentlyStore }) => mostFrequentlyStore, {
    eager: false,
    cascade: ['insert', 'update'],
  })
  @JoinColumn({
    name: 'mostFrequentlyStoreId',
  })
  mostFrequentlyStore: Store;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
