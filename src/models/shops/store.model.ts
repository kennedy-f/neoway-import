import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
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
}
