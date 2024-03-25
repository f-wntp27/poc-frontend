export type BaseResponse<T> = {
  returnStatus: boolean;
  returnMessage: string[];
  errors: string;
  totalPages: number;
  totalRows: number;
  pageSize: number;
  isAuthenicated: boolean;
  entity: T;
};

export type ServerResponse<T> = {
  code: number;
  data: T;
  message?: string | string[];
};

export type ServerPaginationRes<T> = {
  pageCurrent: number;
  pageSize: number;
  totalRows: number;
  data: T[];
};
