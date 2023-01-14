//import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Tweet } from './entity/Tweet';
import { User } from './entity/User';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'root',
  database: 'test',
  synchronize: true,
  logging: false,
  entities: [User, Tweet],
  migrations: [],
  subscribers: [],
});
