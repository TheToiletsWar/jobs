import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';

// 从配置文件中读取数据库配置
const dbConfigPath = path.join('ormconfig.json'); // 注意这里的路径已经更改
const dbConfig = JSON.parse(fs.readFileSync(dbConfigPath, 'utf8'));

export const AppDataSource = new DataSource(dbConfig);
