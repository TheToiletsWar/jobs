import { readFileSync } from 'fs';
import Logger from './common/log';
import Heartbeat from './common/heartbeat';
import 'reflect-metadata';
import axios from 'axios';
import { AppDataSource } from './common';
import { JobsConfigEntity } from './entities/jobs_config.entity';

async function initialize() {
  try {
    // 读取 script_enum.json
    const config = JSON.parse(readFileSync('./script_enum.json', 'utf-8'));
    const scriptName = config.scriptName || 'defaultScript';

    // 启动心跳组件
    Heartbeat.start(3000); // 每3秒发送一次心跳

    // 使用日志组件
    Logger.info('Application started.');

    // 初始化数据库
    await AppDataSource.initialize();

    // 设置axios的baseURL
    await setAxiosBaseUrl();

    // 根据script_enum.json中的配置加载不同的脚本
    const module = await import(`./services/${scriptName}`);
    if (module && typeof module.default === 'function') {
      module.default();
    }
  } catch (error) {
    Logger.error(`Failed to initialize the application: ${error}`);
  }
}

async function setAxiosBaseUrl() {
  const configRepository = AppDataSource.getRepository(JobsConfigEntity);
  // const config = await configRepository.findOne({});

  // if (config && config.restApiIp && config.restApiPort) {
  axios.defaults.baseURL = `http://10.101.243.1:30080/v1`;
  // }
}

// 在程序启动时调用初始化函数
initialize();
