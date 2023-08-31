export interface VariantVal {
  isArray: boolean;
  dataType: string;
  boolVal?: {
    value: boolean;
  };
  int8Val?: {
    value: number;
  };
  int16Val?: {
    value: number;
  };
  int32Val?: {
    value: number;
  };
  int64Val?: {
    value: number;
  };
  uint8Val?: {
    value: number;
  };
  uint16Val?: {
    value: number;
  };
  uint32Val?: {
    value: number;
  };
  uint64Val?: {
    value: number;
  };
  floatVal?: {
    value: number;
  };
  doubleVal?: {
    value: number;
  };
  stringVal?: {
    value: string;
  };
  arrayVal?: {
    value: Array<string | number | boolean>;
  };
}

export interface ItemName {
  portName: string;
  machineryName: string;
  itemName: string;
}

export interface ItemVal {
  itemName: ItemName;
  quality: boolean;
  timestamp: string;
  value?: VariantVal;
  error?: {
    code: number;
    message: string;
  };
}

export interface ItemValHistory {
  itemName: ItemName;
  itemValues?: ItemVal[];
}
