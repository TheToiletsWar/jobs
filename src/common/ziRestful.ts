import axios from "axios";
import { ItemName, ItemVal } from "../interfaces/zi.restful.interface";
import { TagVal } from "../interfaces/api.alias.interface";
import Logger from "../common/log";
import { Dataset } from "../interfaces/data.interface";

async function itemValuesReadPut(itemNames: ItemName[]): Promise<ItemVal[]> {
  const response = await axios.put<ItemVal[]>(
    "http://10.128.231.141:32280/v1/item/values/read",
    itemNames
  );
  return response.data;
}

/**
 * ItemVal to TagVal
 * @param {ItemVal} itemValue ItemVal
 * @returns {TagVal} TagVal
 */
function getTagValue(itemValue: ItemVal): TagVal {
  const { itemName, value } = itemValue;
  const tagVal = {
    name: `${itemName.portName}.${itemName.machineryName}.${itemName.itemName}`,
    quality: itemValue.quality,
    timestamp: new Date(itemValue.timestamp),
  };

  if (value && value.dataType) {
    const valuePropertyName = value.isArray
      ? "arrayVal"
      : value.dataType + "Val";

    Object.assign(tagVal, { type: value.dataType });

    if (value[valuePropertyName]) {
      Object.assign(tagVal, { value: value[valuePropertyName].value });
    }
  }

  if (itemValue.error) {
    Object.assign(tagVal, { error: itemValue.error });
  }

  return tagVal;
}

/**
 * Get tag value array
 * @param {string[]} tagNames Array of Terminal.Crane.Device.Group.Item;Terminal.Crane.Alias.Item;
 * @returns {TagVal[]} Tag value array
 */
async function getTagValues(tagNames: string[]): Promise<TagVal[]> {
  const itemNames = getItemNames(tagNames);

  const tagValues: TagVal[] = [];

  if (!itemNames.length) {
    return tagValues;
  }

  return itemValuesReadPut(itemNames).then((itemValues) => {
    for (const itemValue of itemValues) {
      const tagValue = getTagValue(itemValue);

      if (!tagValue.quality) {
        Logger.warn(`Tag quality is false: ${tagValue.name}`);

        if (tagValue.error) {
          Logger.debug(`${tagValue.error.message}: ${tagValue.name}`);
        }
      } else {
        tagValues.push(tagValue);
      }
    }

    return tagValues;
  });
}

export async function readTags(tagNames: string[]): Promise<Dataset[]> {
  return getTagValues(tagNames).then((tagValues) =>
    tagValues.map((tagValue) => {
      const dataset: Dataset = {
        name: tagValue.name,
        quality: tagValue.quality,
        timestamp: tagValue.timestamp,
        type: tagValue.type,
        value: tagValue.value,
      };
      return dataset;
    })
  );
}
/**
 * Get ItemName array of api
 * @param {string[]} tagNames Array of Terminal.Crane.Device.Group.Item;Terminal.Crane.Alias.Item;
 *  @returns {ItemName} ItemName array of api
 */
function getItemNames(tagNames: string[]): ItemName[] {
  return tagNames
    .map((tagName) => getItemName(tagName))
    .filter((tagName) => tagName);
}

/**
 * Get ItemName of api
 * @param {string} tagName Terminal.Crane.Device.Group.Item;Terminal.Crane.Alias.Item;
 * @returns {ItemName} ItemName of api
 */
function getItemName(tagName: string): ItemName {
  const splitDot = tagName.split(".");

  if (splitDot.length < 3) {
    Logger.debug("Tag address error: " + tagName);
    throw Error("Tag address error");
  }

  return {
    portName: splitDot[0],
    machineryName: splitDot[1],
    itemName: splitDot.splice(2).join("."),
  };
}

export async function setTagValues(
  tagValues: Array<{ name: string; value: any; type?: string }>,
  sync?: boolean,
  timeout?: number,
  target?: string
): Promise<string> {
  const itemValues: Array<Partial<ItemVal>> = [];

  for (const { name, value, type: originalType } of tagValues) {
    const itemName = getItemName(name);
    let type = originalType;

    if (!itemName) {
      throw new Error(`Tag address error: ${name}`);
    }

    if (!type) {
      type = await itemValueItemNameGet(
        itemName.portName,
        itemName.machineryName,
        itemName.itemName
      ).then((itemValue) => {
        if (itemValue.value) {
          return itemValue.value.dataType;
        } else {
          throw new Error(`Tag not found: ${name}`);
        }
      });
    }
    itemValues.push({
      itemName,
      value: {
        isArray: Array.isArray(value),
        dataType: type!,
        [type + "Val"]: { value: value },
      },
    });
  }

  return itemValuesWritePut(itemValues, sync, timeout, target).then(
    () => `Write all tag successful.`
  );
}

/**
 * 读取单个Tag点
 * @param {string} portName 码头名
 * @param {string} machineryName 机器名
 * @param {string} itemName Tag点名
 * @returns {Promise<ItemVal>} Tag点值
 */
async function itemValueItemNameGet(
  portName: string,
  machineryName: string,
  itemName: string
): Promise<ItemVal> {
  const response = await axios.request<ItemVal>({
    method: "GET",
    url: "http://10.128.231.141:32280/v1/item/value/" + itemName,
    params: { portName, machineryName },
  });
  return response.data;
}

/**
 * 批量写入Tag点
 * @param {Array<Partial<ItemVal>>} itemValues Tag点值数组
 * @param {boolean} sync 是否同步写
 * @param {number} timeout 写超时时间
 * @param {string} target 目标topic
 * @returns {Promise<any>} 写入成功返回空值
 */
function itemValuesWritePut(
  itemValues: Array<Partial<ItemVal>>,
  sync?: boolean,
  timeout?: number,
  target?: string
): Promise<any> {
  return axios.request({
    method: "PUT",
    url: "http://10.128.231.141:32280/v1/item/values/write",
    data: itemValues,
    params: { sync, timeout, target },
  });
}
