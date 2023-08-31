import { DataSource } from 'typeorm';
import { EquipWorkByHourEntity } from '../entities/equip.workbyhour.entity';
import 'reflect-metadata';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: '10.128.231.60',
  port: 31129,
  username: 'root',
  password: 'Zpmc@3261',
  database: 'order_server',
  entities: [__dirname + '/entity/*{.js,.ts}'],
  synchronize: true,
  logging: false,
});
