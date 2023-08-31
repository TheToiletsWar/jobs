export type TagValue =
  | string
  | number
  | boolean
  | Array<string | number | boolean>;

export interface Dataset {
  name: string;
  value?: TagValue;
  type?: string;
  quality: boolean;
  timestamp: Date;
  alias?: DatasetAlias;
}

export interface DatasetAlias extends Dataset {
  operator: string;
  exp: number;
}

export interface DatasetHistory {
  name: string;
  values: {
    timestamp: Date;
    value: TagValue;
  }[];
}

export interface IDataWrite {
  name: string;
  value: TagValue;
  type?: string;
  sync?: boolean;
  timeout?: number;
  target?: string;
}

export interface IDataWriteArray {
  tagValues: Array<{
    name: string;
    value: TagValue;
    type?: string;
  }>;
  sync?: boolean;
  timeout?: number;
  target?: string;
}

export interface IDataHistory {
  startTime: Date;
  endTime: Date;
  tagNames: string[];
  period: number;
  func: 'org' | 'min' | 'max' | 'avg';
}
