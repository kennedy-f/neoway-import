import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Shop } from 'models/shops/shop.model';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  cpf: string;

  @Column({ default: false })
  private: boolean;

  @Column({ default: false })
  incomplete: boolean;

  @Column()
  @ManyToOne(() => Shop, shop => shop.id)
  latestBuyShop: number;

  @Column()
  @ManyToOne(() => Shop, shop => shop.id)
  mostFrequentlyShop: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
