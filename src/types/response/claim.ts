import { IResponseCommonList } from './common';

export interface IResponseClaimPrepare {
  begin_epoch: number;
  end_epoch: number;
  latest_epoch: number;
  performances: IResponseClaimPrepareItem[];
}

export interface IResponseClaimRun {
  nonce: number;
  signature: string;
  operator_ids: number[];
  earnings: string[];
  penalties: string[];
  owner: string;
  claimBlockNumber: number;
}

export interface IResponseClaimPrepareItem {
  last_epoch: number;
  attested: string;
  missed: string;
  operator_id: number;
  operator_pubkey: string;
  operator_owner: string;
  validator_id: number;
  validator_pubkey: string;
}

export enum IResponseClaimRecordItemStatusEnum {
  pending = 'pending',
  accept = 'accept',
  revert = 'revert',
  finished = 'finished',
}

export interface IResponseClaimRecordItem {
  id: number;
  address: string;
  epoch: number;
  status: IResponseClaimRecordItemStatusEnum;
  begin_epoch: number;
  end_epoch: number;
  tx_hash?: string;
  //  "event_data": "{\"nonce\":\"6\",\"to\":\"0x38E958e48c129E11d2d72a34B9555A4278FC6680\",\"claimed\":\"59251022727272395467\",\"penalty\":\"19750340909090798489\",\"blockNumber\":\"1817342\"}",
  event_data: string;
  time: string;
  createdAt: string;
  updatedAt: string;
  version: number;
  operators: any[];
}

export interface IResponseClaimRecordItemEventData {
  nonce: string;
  to: string;
  claimed: string;
  penalty: string;
  blockNumber: string;
}

export interface IResponseClaimRecordItemList
  extends IResponseCommonList<IResponseClaimRecordItem[]> {}
