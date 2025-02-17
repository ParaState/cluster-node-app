export interface IResponseInitiatorStatus {
  cluster_pubkey: `0x${string}`;
  created_at: number;
  owner?: `0x${string}`;
  status: string;
  updated_at: number;
}

export enum IResponseInitiatorStatusEnum {
  ready = 'Ready',
  completed = 'Completed',
}

export enum IResponseValidatorStatusEnum {
  all = 'All',
  ready = 'Ready',
  registered = 'Registered',
  deposited = 'Deposited',
  exited = 'Exited',
}

export enum IRequestValidatorActionEnum {
  register = 'register',
  deposit = 'deposit',
  exit = 'exit',
}

export interface IResponseClusterNodeValidatorItem {
  cluster_pubkey: string;
  created_at: number;
  deposit_data: string;
  deposit_txid?: string;
  exit_txid?: string;
  generate_txid: string;
  id: number;
  operators: {
    encrypt_key: string;
    operator_id: number;
    operator_pubkey: string;
    shared_key: string;
  }[];
  owner: string;
  pubkey: string;
  register_txid?: string;
  status: string;
  updated_at: number;
}
