import cron from 'node-cron';
import Logger from '../common/log';
import { readTags, setTagValues } from '../common/ziRestful';
import { DataSource } from 'typeorm';
import { AppDataSource } from '../common';
import { CraneEntity } from '../entities/crane.entity';
import { RemoteDriverEntity } from '../entities/remote.driver.entity';
import { WriteTagDto } from '../dto/write.tag.dto';

export default async function startCronJob() {
  // 每分钟的第30秒运行任务
  cron.schedule('*/5 * * * * *', async () => {
    Logger.info('Running a task every minute at 30th second.');
    try {
      await fetchDataAndUpdateTags();
    } catch (error) {
      Logger.error(`An error occurred during the cron job,${error}`);
    }
  });
}

async function fetchDataAndUpdateTags() {
  // RCS range = 1-13 and 31
  // 实时点获取craneId和userId
  const readTagnames = generateTags(
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 31],
    `RCS`,
  );
  // console.log('readTagnames :>> ', readTagnames);
  const tagData = await readTags(readTagnames);
  // console.log('tagData :>> ', tagData);
  // 获取数据库数据
  const entityManager = AppDataSource.createEntityManager();
  const cranes = await entityManager.find(CraneEntity);
  const remoteDriver = await entityManager.find(RemoteDriverEntity);
  // console.log('crane :>> ', cranes);
  // console.log('remoteDriver :>> ', remoteDriver);
  // 匹配craneId
  const writeData: WriteTagDto[] = [];
  for (const tag of tagData) {
    const splitDot = tag.name.split('.');
    const itemName = splitDot[splitDot.length - 1];
    // const crane = cranes.find((item) => item.cranevalue === machineryName);
    switch (itemName) {
      case `Cmsuserid`:
        const currDriver = remoteDriver.find(
          (driver) => driver.id === tag.value,
        );
        if (currDriver) {
          writeData.push({
            name: tag.name.replace('RCS.Cmsuserid', 'Mem.Cmsusername'),
            value: currDriver.lastName + currDriver.firstName,
            type: `string`,
          });
        } else {
          writeData.push({
            name: tag.name.replace('RCS.Cmsuserid', 'Mem.Cmsusername'),
            value: '',
            type: `string`,
          });
        }
        break;

      case `ConnectCraneNo`:
        const currCrane = cranes.find((crane) => crane.craneId === tag.value);
        if (currCrane) {
          writeData.push({
            name: tag.name.replace(
              'RCS.ConnectCraneNo',
              'Mem.ConnectCranename',
            ),
            value: currCrane.craneName,
            type: `string`,
          });
        } else {
          writeData.push({
            name: tag.name.replace(
              'RCS.ConnectCraneNo',
              'Mem.ConnectCranename',
            ),
            value: '',
            type: `string`,
          });
        }
        break;
    }
  }
  // 执行写入操作
  const writeResult = await setTagValues(writeData, false, 15000, 'memory-bus');
  console.log('Write result:', writeResult);
}
/**
 *
 * @param ids crane的数字编号
 * @param craneType crane的类型：QC RTG RCS
 */
function generateTags(ids: number[], craneType: string) {
  const portName = `YongZhou`;
  const userIdItemName = 'RCS.Cmsuserid';
  const craneIdItemName = 'RCS.ConnectCraneNo';
  const machineryNameArray: string[] = [];
  for (const id of ids) {
    const userId = `${portName}.${craneType}${id}.${userIdItemName}`;
    const craneId = `${portName}.${craneType}${id}.${craneIdItemName}`;
    machineryNameArray.push(...[userId, craneId]);
  }
  return machineryNameArray;
}
