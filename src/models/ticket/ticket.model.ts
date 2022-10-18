import {
  Column,
  CreateDateColumn,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../user';
import { Store } from '../shops';

export class Ticket {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  storeId: number;

  @Column()
  value: number;

  @Column()
  valueCents: number;

  @Column()
  currency: string;

  @Column()
  ticketDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, ({ tickets }) => tickets)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Store, ({ tickets }) => tickets)
  @JoinColumn({ name: 'storeId' })
  store: Store;
}
