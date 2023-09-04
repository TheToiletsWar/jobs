import cron from 'node-cron';
import Logger from '../common/log';
import { readTags, setTagValues } from '../common/ziRestful';
import { EquipWorkByHourEntity } from '../entities/equip.workbyhour.entity';
import { AppDataSource } from '../common';
import { DevicesListEntity } from '../entities/devices.list.entity';
import { WorkByHourDto } from '../dto/workbyhour.dto';
import { WriteTagDto } from '../dto/write.tag.dto';
import { CraneProductDto } from '../dto/crane.product.dto';


async function fetchDataAndUpdateTags() {
  const entityManager = AppDataSource.createEntityManager();
  const workByHourData = (
    await entityManager
      .createQueryBuilder()
      .select(
        `
      CASE
      WHEN
      workbyhour.equip_id LIKE 'RTG%' 
              THEN
                  equip_id 
      WHEN 
      workbyhour.equip_id LIKE 'RT%' 
              THEN
                  CONCAT( 'RTG', LPAD( SUBSTR( workbyhour.equip_id, 3 ), 3, '0' ) ) 
      WHEN 
      workbyhour.equip_id LIKE 'CR%' 
              THEN 
                  CONCAT( 'CR', LPAD( SUBSTR(workbyhour.equip_id, 3 ), 2, '0' ) )  
      ELSE workbyhour.equip_id   END 
       `,
        'equipId',
      )
      .addSelect('SUM(workbyhour.nosCount)', 'nosCount')
      .addSelect('SUM(workbyhour.teuCount)', 'teuCount')
      .from(EquipWorkByHourEntity, 'workbyhour')
      .where('workbyhour.equipId LIKE :cr', { cr: 'CR%' })
      .orWhere('workbyhour.equipId LIKE :rt', { rt: 'RT%' })
      .groupBy('workbyhour.equip_id')
      .getRawMany()
  ).map((rawData) => new WorkByHourDto(rawData));
  const cranes = await entityManager
    .createQueryBuilder(DevicesListEntity, 'devices')
    .where('devices.name LIKE :cr', { cr: '%CR%' })
    .orWhere('devices.name LIKE :rt', { rt: '%RT%' })
    .getMany();

  const qcNosPrefix = 'Mem.Modified.CRNOS';
  const qcTeuPrefix = 'Mem.Modified.CRTeu';
  const rtgNosPrefix = 'Mem.Modified.RTNOS';
  const rtgTeuPrefix = 'Mem.Modified.RTTeu';
  const tagNames: string[] = [];
  const rtgMap = new Map<DevicesListEntity, CraneProductDto>();
  const crMap = new Map<DevicesListEntity, CraneProductDto>();
  for (const crane of cranes) {
    switch (crane.device_type) {
      case '桥吊':
        tagNames.push(
          `NingBo.${crane.cranevalue}.${qcNosPrefix}`,
          `NingBo.${crane.cranevalue}.${qcTeuPrefix}`,
        );
        if (!crMap.has(crane)) {
          crMap.set(crane, {
            currentTeu: 0,
            modifiedTeu: 0,
            statisticsTeu: 0,

            currentNos: 0,
            statisticsNos: 0,
            modifiedNos: 0,
          });
        }
        break;

      case '龙门吊':
        tagNames.push(
          `NingBo.${crane.cranevalue}.${rtgNosPrefix}`,
          `NingBo.${crane.cranevalue}.${rtgTeuPrefix}`,
        );
        if (!rtgMap.has(crane)) {
          rtgMap.set(crane, {
            currentTeu: 0,
            modifiedTeu: 0,
            statisticsTeu: 0,

            currentNos: 0,
            statisticsNos: 0,
            modifiedNos: 0,
          });
        }
        break;
    }
  }
  // tagNames
  const tagData = await readTags(tagNames);

  // 修正值
  for (const tag of tagData) {
    const splitDot = tag.name.split('.');
    const machineryName = splitDot[1];
    const productInfo = workByHourData.find(
      (item) => item.equipId === machineryName,
    );
    const crane = cranes.find((item) => item.cranevalue === machineryName);
    switch (crane?.device_type) {
      case '桥吊':
        if (crane) {
          const craneProduct = crMap.get(crane);
          if (craneProduct) {
            if (tag.name.includes(qcNosPrefix)) {
              craneProduct.modifiedNos = Number(tag.value);
            } else if (tag.name.includes(qcTeuPrefix)) {
              craneProduct.modifiedTeu = Number(tag.value);
            }
          }
        }

        break;
      case '龙门吊':
        if (crane) {
          const craneProduct = rtgMap.get(crane);
          if (craneProduct) {
            if (tag.name.includes(rtgNosPrefix)) {
              craneProduct.modifiedNos = Number(tag.value);
            } else if (tag.name.includes(rtgTeuPrefix)) {
              craneProduct.modifiedTeu = Number(tag.value);
            }
          }
        }
        break;
    }
  }
  // 统计值
  for (const productInfo of workByHourData) {
    const machineryName = productInfo.equipId;
    const crane = cranes.find((item) => item.cranevalue === machineryName);
    switch (crane?.device_type) {
      case '桥吊':
        if (crane) {
          const craneProduct = crMap.get(crane);
          if (craneProduct) {
            craneProduct.statisticsNos = productInfo.nosCount;
            craneProduct.statisticsTeu = productInfo.teuCount;
            craneProduct.currentNos =
              craneProduct.modifiedNos + productInfo.nosCount;
            craneProduct.currentTeu =
              craneProduct.modifiedTeu + productInfo.teuCount;
          }
        }

        break;
      case '龙门吊':
        if (crane) {
          const craneProduct = rtgMap.get(crane);
          if (craneProduct) {
            craneProduct.statisticsNos = productInfo.nosCount;
            craneProduct.statisticsTeu = productInfo.teuCount;
            craneProduct.currentNos =
              craneProduct.modifiedNos + productInfo.nosCount;
            craneProduct.currentTeu =
              craneProduct.modifiedTeu + productInfo.teuCount;
          }
        }
        break;
    }
  }

  // 准备用于写入的数据数组
  const writeData: WriteTagDto[] = [];

  // 遍历crMap以获取桥吊（QC）的数据
  for (const [crane, craneProduct] of crMap) {
    const craneName = crane.cranevalue; // 设备名称
    const nosTag = `NingBo.${craneName}.Mem.Current.CRNOS`; // NOS点位名称
    const teuTag = `NingBo.${craneName}.Mem.Current.CRTeu`; // TEU点位名称
    const statisticsNosTag = `NingBo.${craneName}.Mem.Statistics.CRNOS`; // 统计值NOS点位名称
    const statisticsTeuTag = `NingBo.${craneName}.Mem.Statistics.CRTeu`; // 统计值NOS点位名称

    // 添加到写入数据数组
    writeData.push(
      new WriteTagDto({
        name: nosTag,
        value: craneProduct.currentNos,
        type: 'float',
      }),
      new WriteTagDto({
        name: teuTag,
        value: craneProduct.currentTeu,
        type: 'float',
      }),
      new WriteTagDto({
        name: statisticsNosTag,
        value: craneProduct.statisticsNos,
        type: 'float',
      }),
      new WriteTagDto({
        name: statisticsTeuTag,
        value: craneProduct.statisticsTeu,
        type: 'float',
      }),
    );
  }

  // 遍历rtgMap以获取龙门吊（RTG）的数据
  for (const [crane, craneProduct] of rtgMap) {
    const craneName = crane.cranevalue; // 设备名称
    const nosTag = `NingBo.${craneName}.Mem.Current.RTNOS`; // NOS点位名称
    const teuTag = `NingBo.${craneName}.Mem.Current.RTTeu`; // TEU点位名称
    const statisticsNosTag = `NingBo.${craneName}.Mem.Statistics.RTNOS`; // 统计值NOS点位名称
    const statisticsTeuTag = `NingBo.${craneName}.Mem.Statistics.RTTeu`; // 统计值NOS点位名称

    // 添加到写入数据数组
    writeData.push(
      new WriteTagDto({
        name: nosTag,
        value: craneProduct.currentNos,
        type: 'float',
      }),
      new WriteTagDto({
        name: teuTag,
        value: craneProduct.currentTeu,
        type: 'float',
      }),
      new WriteTagDto({
        name: statisticsNosTag,
        value: craneProduct.statisticsNos,
        type: 'float',
      }),
      new WriteTagDto({
        name: statisticsTeuTag,
        value: craneProduct.statisticsTeu,
        type: 'float',
      }),
    );
  }
  // 执行写入操作
  const writeResult = await setTagValues(writeData, false, 15000, 'memory-bus');
  console.log('Write result:', writeResult);
}

// 初始化数据源和定时任务
export default async function startCronJob() {


  // 每小时执行一次
  cron.schedule('* * * * *', async () => {
    try {
      await AppDataSource.initialize();
      await fetchDataAndUpdateTags();
    } catch (error) {
      Logger.error(`An error occurred during the cron job,${error}`);
    }
  });
}
