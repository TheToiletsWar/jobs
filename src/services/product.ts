import cron from 'node-cron';
import Logger from '../common/log';
import { readTags, setTagValues } from '../common/ziRestful';
import { EquipWorkByHourEntity } from '../entities/equip.workbyhour.entity';
import { AppDataSource } from '../common';
import { DevicesListEntity } from '../entities/devices.list.entity';
import { Like } from 'typeorm';
import { WorkByHourDto } from '../dto/workbyhour.dto';
import { WriteTagDto } from '../dto/write.tag.dto';

export default async function startCronJob() {
  console.log('script start :>> ');
  await AppDataSource.initialize();
  const entityManager = AppDataSource.createEntityManager();
  const workByHourData =  (
    await entityManager
      .createQueryBuilder()
      .select('workbyhour.equip_id', 'equipId')
      .addSelect('SUM(workbyhour.nosCount)', 'nosCount')
      .addSelect('SUM(workbyhour.teuCount)', 'teuCount')
      .from(EquipWorkByHourEntity, 'workbyhour')
      .where('workbyhour.equipId LIKE :cr', { cr: 'CR%' })
      .orWhere('workbyhour.equipId LIKE :rt', { rt: 'RT%' })
      .groupBy('workbyhour.equip_id')
      .getRawMany()
  ).map((rawData) => new WorkByHourDto(rawData));
  console.log('workByHourData :>> ', workByHourData.length);
  const cranes = await entityManager
    .createQueryBuilder(DevicesListEntity, 'devices')
    .where('devices.name LIKE :cr', { cr: '%CR%' })
    .orWhere('devices.name LIKE :rt', { rt: '%RT%' })
    .getMany();

  console.log('cranes :>> ', cranes.length);
  const qcNosPrefix = 'Modified.CRNOS';
  const qcTeuPrefix = 'Modified.CRTeu';
  const rtgNosPrefix = 'Modified.RTNOS';
  const rtgTeuPrefix = 'Modified.RTTeu';
  const tagNames: string[] = [];
  for (const crane of cranes) {
    switch (crane.device_type) {
      case '桥吊':
        tagNames.push(
          `NingBo.${crane.cranevalue}.${qcNosPrefix}`,
          `NingBo.${crane.cranevalue}.${qcTeuPrefix}`,
        );
        break;

      case '龙门吊':
        tagNames.push(
          `NingBo.${crane.cranevalue}.${rtgNosPrefix}`,
          `NingBo.${crane.cranevalue}.${rtgTeuPrefix}`,
        );
        break;
    }
  }
  // tagNames
  const tagData = await readTags(tagNames);
  const writeTag: WriteTagDto[] = [];
  for (const tag of tagData) {
    const splitDot = tag.name.split('.');
    const machineryName = splitDot[1];
    const productInfo = workByHourData.find(
      (item) => item.equipId === machineryName,
    );
    const currentTeuTag = 0;
  }
}
