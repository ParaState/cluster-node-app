export * from './response';

export interface TransactionResult {
  blockHash: string;
  blockNumber: number;
  contractAddress?: any;
  cumulativeGasUsed: number;
  effectiveGasPrice: string;
  from: string;
  gasUsed: number;
  logsBloom: string;
  status: boolean;
  to: string;
  transactionHash: string;
  transactionIndex: number;
  type: string;
  events?: any;
}

export interface CommonPagination {
  page: number;
  per_page: number;
  pages: number;
  total: number;
}

export enum DataTableRoleEnum {
  operators = 'operators',
  validators = 'validators',
  initiators = 'initiators',
}

export type DataTableRoleType = keyof typeof DataTableRoleEnum;

export enum CurrentFeeMode {
  month = 'month',
  year = 'year',
  minimum = 'minimum',
}

export enum SortTypeEnum {
  asc = 1,
  desc = -1,
}
