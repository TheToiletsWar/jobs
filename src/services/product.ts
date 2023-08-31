import cron from 'node-cron';
import Logger from '../common/log';
import { readTags, setTagValues } from '../common/ziRestful';
import { EquipWorkByHourEntity } from '../entities/equip.workbyhour.entity';
import { AppDataSource } from '../common';

export default async function startCronJob() {
  console.log('script start :>> ');
  const data = await AppDataSource.createQueryBuilder()
    .select('workbyhour.equip_id', 'craneId')
    .from(EquipWorkByHourEntity, 'workbyhour')
    .getMany();
  console.log('data :>> ', data);
  const flag = await setTagValues(
    [
      {
        name: 'PSA.QC2201.QCOS_P_OpsMode',
        type: 'string',
        value: 'EO',
      },
    ],
    false,
    15000,
    'memory-bus',
  );
  console.log('flag :>> ', flag);
  // const dataset = await readTags([
  //   "PSA.QC2201.QCOS_P_OpsMode",
  //   "PSA.QC2201.QCOS_S_OpsMode",
  // ]);
  // console.log("dataset :>> ", dataset);
  // 你的业务逻辑
  // });
}
