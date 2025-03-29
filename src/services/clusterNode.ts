import axiosInstance from '@/utils/axios';

import {
  IResponseOperators,
  IResponseInitiatorStatus,
  IRequestValidatorActionEnum,
  IResponseValidatorStatusEnum,
  IResponseClusterNodeValidatorItem,
} from '@/types';

export async function fetchOperators(body: any): Promise<IResponseOperators> {
  try {
    const { data } = await axiosInstance.post(`/server/operator/query`, body);

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
  const { data } = await axiosInstance.post(`/server/initiator/bind/${owner}`);

  return data.data;
}

export async function queryValidatorStatus(body: {
  pubkey: string;
  status: IResponseValidatorStatusEnum | string;
  generate_txid: string;
  register_txid: string;
  deposit_txid: string;
  exit_txid: string;
}): Promise<IResponseClusterNodeValidatorItem[]> {
  const { data } = await axiosInstance.post(`/server/validator/query`, body);

  const list = data.data as IResponseClusterNodeValidatorItem[];

  if (list) {
    list.forEach((item) => {
      item.operators.sort((a, b) => a.operator_id - b.operator_id);
    });
  }

  return list;
}

export async function updateValidatorStatus(
  body: {
    pubkey: string;
    action: IRequestValidatorActionEnum;
    txid?: string;
  }[]
): Promise<IResponseClusterNodeValidatorItem[]> {
  const { data } = await axiosInstance.post(`/server/validator/update`, body);

  return data.data;
}

export async function fetchLidoCSM(body: any) {
  try {
    const { data } = await axiosInstance.post(`/server/lidocsms/query`, body);

    return data.data;
  } catch (error: any) {
    console.error(`Error in fetchLidoCSM: ${error}`);
    throw error;
  }
}
