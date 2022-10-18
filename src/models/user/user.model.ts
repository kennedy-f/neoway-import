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
import { Store } from '../shops';
import { Ticket } from '../ticket';

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
  mediumTicket: number;

  @Column({ nullable: true })
  mediumTicketCents: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Ticket, ({ user }) => user, {
    eager: false,
    cascade: ['insert'],
  })
  tickets?: Ticket[];

  @ManyToOne(() => Store, ({ mostFrequentlyStore }) => mostFrequentlyStore, {
    eager: false,
    cascade: ['insert', 'update'],
  })
  @JoinColumn({
    name: 'mostFrequentlyStoreId',
  })
  mostFrequentlyStore: Store;
}
