import fs from "fs";
import { GlobalConfig } from "../interfaces/global.config.interface";

export async function getGlobalConfig(jsonPath: string): Promise<GlobalConfig> {
  return {
    positionThreshold: 10,
    kafkaTopicName: "memory",
    restPort: 32261,
    restWritePort: 32261,
    restIp: "httP://10.128.231.141:32280/V1",
  };
}
