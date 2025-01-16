import { IResponseCommonList } from './common';

export interface IResponseOperatorItem {
  id: number;
  name: string;
  address: string;
  pk: string;
  type: number;
  status: string;
}

export interface IResponseOperators extends IResponseCommonList<IResponseOperator[]> {}

export enum IResponseOperatorStatusEnum {
  ative = 'active',
  inactive = 'inactive',
  // custom field, backend not return
  ready = 'ready',
}

export interface IResponseOperator {
  month_performance: {
    attested: number;
    missed: number;
    performance: number;
  };
  id: number;
  name: string;
  owner: string;
  pk: string;
  verified: number;
  fromDao: number;
  validator_count: number;
  tx: string;
  block: number;
  last_epoch: number;
  last_validator: number;
  status: string;
  last_version: string;
  last_ping: number;
  last_claim_height: number;
  createdAt: string;
  updatedAt: string;
  version: number;
  earning: number;

  operator_detail?: {
    logo: string;
    description: string;
    eth1_node_client: string;
    eth2_node_client: string;
    location: string;
    mev_relays: string[];
    provider: string;
    links: {
      twitter: string;
      website: string;
      linkedin: string;
    };
  };
}

export enum OperatorTypeDescEnum {
  nomal = 'Normal',
  verified = 'Verified',
  dao = 'DAO',
}

export interface IResponseOperatorPerformance {
  last_epoch: number;
  attested: string;
  missed: string;
  operator_id: number;
  operator_pubkey: string;
}

export interface IResponseOperatorPerformanceList
  extends IResponseCommonList<IResponseOperatorPerformance[]> {}

export interface IResponseOperationReportItem {
  operators: number[];
  id: number;
  publicKey: string;
  operatorId: number;
  time: number;
  duty: string;
  epoch: number;
  slot: number;
  sign_hex: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  version: number;
}

export const renderOperatorType = (op: IResponseOperator) => {
  if (op.fromDao) {
    return OperatorTypeDescEnum.dao;
  }
  if (op.verified) {
    return OperatorTypeDescEnum.verified;
  }
  return OperatorTypeDescEnum.nomal;
};

export interface IResponseOperationReportList
  extends IResponseCommonList<IResponseOperationReportItem[]> {}

export interface IResponseClaims extends IResponseCommonList<IResponseClaim[]> {}

export interface IResponseClaim {
  id: number;
  address: string;
  epoch: number;
  status: string;
  begin_epoch: number;
  end_epoch: number;
  tx_hash: string | null;
  event_data: string;
  time: string;
  createdAt: string;
  updatedAt: string;
  version: number;
}
