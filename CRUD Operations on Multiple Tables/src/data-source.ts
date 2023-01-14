//import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Note } from './entity/Note';
import { SharedNote } from './entity/SharedNote';
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
  entities: [User, Note, SharedNote],
  migrations: [],
  subscribers: [],
});
