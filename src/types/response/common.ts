export interface IRequestCommonPagination {
  offset: number;
  limit: number;
}

export const defaultPagination: IRequestCommonPagination = {
  offset: 0,
  limit: 10,
};

export interface IResponseCommonList<T = any> {
  count: number;
  rows: T;
}

export const defaultResponseList: IResponseCommonList = {
  count: 0,
  rows: [],
};

export interface IResponseCommonData<T = any> {
  code: number;
  message: string;
  data: T;
}

export enum PerformanceTypeEnum {
  oneDay = '1D',
  thirtyDays = '1M',
}
