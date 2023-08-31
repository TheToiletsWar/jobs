export interface AliasItem {
  aliasName: string;
  itemName: string;
  tagName?: string;
  operator?: string;
  exp?: number;
}

export interface CSVItem {
  aliasName: string;
  itemName: string;
  operate: string;
  description: string;
}

export interface TagVal {
  name: string;
  quality: boolean;
  timestamp: Date;
  type?: string;
  value?: string | number | boolean | Array<string | number | boolean>;
  error?: {
    code: number;
    message: string;
  };
  alias?: AliasItem;
  aliasValue?: TagVal;
}

export interface TagValHistory {
  tagName: string;
  tagValues?: TagVal[];
}
