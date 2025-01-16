import axiosInstance from '@/utils/axios';

import {
  IResponseOperators,
  IResponseInitiatorStatus,
  IResponseValidatorStatusEnum,
  IResponseClusterNodeValidatorItem,
} from '@/types';

export async function fetchOperators(offset: number = 0): Promise<IResponseOperators> {
  try {
    const { data } = await axiosInstance.get(`/server/operator/pag/${offset}`);

    return data.data;
  } catch (error: any) {
    console.error(`Error in getOperators: ${error}`);
    throw error;
  }
}

// initiator/status
export async function getInitiatorStatus(): Promise<IResponseInitiatorStatus> {
  const { data } = await axiosInstance.get(`/server/initiator/status`);

  return data.data;
}

// {{host}}/initiator/bind/:owner
export async function bindInitiatorOwner(owner: string) {
  const { data } = await axiosInstance.get(`/server/initiator/bind/${owner}`);

  return data.data;
}

export async function queryValidatorStatus(
  status: IResponseValidatorStatusEnum
): Promise<IResponseClusterNodeValidatorItem[]> {
  const { data } = await axiosInstance.get(`/server/validator/${status}`);

  return data.data;
}

export async function updateValidatorStatus(
  pubkey: string,
  action: string | 'register' | 'deposit' | 'exit',
  txid: string
): Promise<IResponseClusterNodeValidatorItem[]> {
  const { data } = await axiosInstance.post(`/server/validator/${pubkey}/${action}/${txid}`);

  return data.data;
}
