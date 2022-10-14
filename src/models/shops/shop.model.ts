import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from 'models/user/user.model';

@Entity('user')
export class Shop {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  cnpj: string;

  @ManyToOne(() => User, ({ latestBuyShop }) => latestBuyShop)
  latestBuyShop: number;

  @ManyToOne(() => User, ({ mostFrequentlyShop }) => mostFrequentlyShop)
  mostFrequentlyShop: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
