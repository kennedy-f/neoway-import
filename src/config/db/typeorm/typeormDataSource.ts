import { DataSource } from 'typeorm';
import * as Entities from '../../../models';

export const TypeormDataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: Number(process.env?.POSTGRES_PORT || 5432),
  username: process.env.POSTGRES_USER || 'root',
  password: process.env.POSTGRES_PASSWORD || 'root',
  database: process.env.POSTGRES_DB || 'root',
  synchronize: true,
  logging: false,
  entities: Entities,
  subscribers: [],
  migrations: [],
});
