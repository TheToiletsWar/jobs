import cron from "node-cron";
import Logger from "../common/log";
import { readTags, setTagValues } from "../common/ziRestful";
import { DataSource } from "typeorm"

export default async function startCronJob() {
  // 每分钟的第30秒运行任务
  // cron.schedule("30 * * * * *", () => {
  // Logger.info("Running a task every minute at 30th second.");

  const flag = await setTagValues(
    [
      {
        name: "PSA.QC2201.QCOS_P_OpsMode",
        type: "string",
        value: "EO",
      },
    ],
    false,
    15000,
    "memory-bus"
  );
  console.log("flag :>> ", flag);
  // const dataset = await readTags([
  //   "PSA.QC2201.QCOS_P_OpsMode",
  //   "PSA.QC2201.QCOS_S_OpsMode",
  // ]);
  // console.log("dataset :>> ", dataset);
  // 你的业务逻辑
  // });
}
