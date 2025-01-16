import { IResponseCommonList } from './common';

export interface IResponseValidatorItem {
  id: number;
  address: string;
  pk: string;
  paid: number;
  beacon_index: string;
  status: string;
  beacon_status: string;
  activation_epoch: number;
  retry: number;
  createdAt: string;
  updatedAt: string;
  version: number;
  operators: IResponseOperatorMapsItem[];
}

export interface IResponseOperatorMapsItem {
  id: number;
  validator_id: number;
  ready: number;
  operator_name: string;
  validator_pubkey: string;
  operator_id: number;
  operator_owner: string;
  status: string;
  validator?: {
    status: string;
  };
}

export interface IResponseValidators extends IResponseCommonList<IResponseValidatorItem[]> {}

export interface IResponseOperatorMapsList
  extends IResponseCommonList<IResponseOperatorMapsItem[]> {}

export interface IResponseValidatorHissItem {
  id: number;
  validator_id: number;
  validator_pubkey: string;
  duty?: any;
  epoch: number;
  slot?: any;
  time: string;
  income: number;
  attestation_count: number;
  miss_count: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  version: number;

  operators?: {
    operator_id: number;
    operator_name: string;
    status: string;
  }[];
}

export interface IResponseValidatorHissList
  extends IResponseCommonList<IResponseValidatorHissItem[]> {}

export interface IResponseValidatorBeaconItem {
  activationeligibilityepoch: number;
  activationepoch: number;
  balance: number;
  effectivebalance: number;
  exitepoch: number;
  lastattestationslot: number;
  name: string;
  pubkey: string;
  slashed: boolean;
  status: string;
  validatorindex: number;
  withdrawableepoch: number;
  withdrawalcredentials: string;
  total_withdrawals: number;
}
