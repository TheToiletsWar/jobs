import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { EquipWorkByHourEntity } from '../entities/equip.workbyhour.entity';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: '10.128.231.60',
  port: 31129,
  username: 'root',
  password: 'Zpmc@3261',
  database: 'order_server',
  entities: ['src/entities/*.entity{.js,.ts}'],
  synchronize: false,
  logging: true,
});
