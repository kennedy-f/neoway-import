import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../user';
import { Store } from '../shops';

@Entity('tickets')
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
  cents: number;

  @Column()
  currency: string;

  @Column()
  ticketDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, ({ tickets }) => tickets, {
    eager: false,
    cascade: ['insert'],
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Store, ({ tickets }) => tickets, {
    eager: false,
    cascade: ['insert'],
  })
  @JoinColumn({ name: 'storeId' })
  store: Store;

  // currencyValue(): number {
  //   const value = `${this.value}.${this.cents}`;
  //   return Number(value);
  // }
}
