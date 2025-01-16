export interface IResponseInitiatorStatus {
  cluster_pubkey: `0x${string}`;
  created_at: number;
  owner?: `0x${string}`;
  status: string;
  updated_at: number;
}

export enum IResponseValidatorStatusEnum {
  ready = 'ready',
  registered = 'registered',
  deposited = 'deposited',
  exited = 'exited',
}

export interface IResponseClusterNodeValidatorItem {
  cluster_pubkey: string;
  created_at: number;
  deposit_data: string;
  id: number;
  operators: {
    encrypt_key: string;
    operator_id: number;
    operator_pubkey: string;
    shared_key: string;
  }[];
  owner: string;
  pubkey: string;
  status: string;
  updated_at: number;
}
