import { readFileSync } from 'fs';
import Logger from './common/log';
import Heartbeat from './common/heartbeat';
import 'reflect-metadata';

// 读取 script_enum.json
const config = JSON.parse(readFileSync('./script_enum.json', 'utf-8'));
const scriptName = config.scriptName || 'defaultScript';

// 启动心跳组件
Heartbeat.start(3000); // 每3秒发送一次心跳

// 使用日志组件
Logger.info('Application started.');

// 根据script_enum.json中的配置加载不同的脚本
import(`./services/${scriptName}`)
  .then(async (module) => {
    if (module && typeof module.default === 'function') {
      module.default();
    }
  })
  .catch((error) => {
    console.error(`Failed to load script: ${scriptName}`, error);
  });
