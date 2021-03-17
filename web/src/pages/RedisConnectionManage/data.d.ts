export type TableListItem = {
  _id?: string;
  id?: string;
  name?: string;
  host?: string;
  port?: number;
  password?: string;
  username?: string;
};

export type TableListPagination = {
  total: number;
  pageSize: number;
  current: number;
};

export type TableListData = {
  list: TableListItem[];
  pagination: Partial<TableListPagination>;
};

export type TableListParams = {
  id?: string;
  name?: string;
  desc?: string;
  key?: number;
  pageSize?: number;
  current?: number;
  filter?: Record<string, any[]>;
  sorter?: Record<string, any>;
};

export type RedisConnectionParams = {
  id?: string;
  name?: string;
  host?: string;
  port?: number;
  password?: string;
  username?: string;
  desc?: string;
};
