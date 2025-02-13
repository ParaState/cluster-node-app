import axiosInstance from '@/utils/axios';

import {
  IResponseOperators,
  IResponseInitiatorStatus,
  IResponseValidatorStatusEnum,
  IResponseClusterNodeValidatorItem,
} from '@/types';

// export async function fetchOperators(offset: number = 0): Promise<IResponseOperators> {
//   try {
//     const { data } = await axiosInstance.get(`/server/operator/pag/${offset}`);

//     return data.data;
//   } catch (error: any) {
//     console.error(`Error in getOperators: ${error}`);
//     throw error;
//   }
// }
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
  const { data } = await axiosInstance.get(`/server/initiator/bind/${owner}`);

  return data.data;
}

export async function queryValidatorStatus(
  status: IResponseValidatorStatusEnum,
  action: IResponseValidatorStatusEnum,
  txid: string
): Promise<IResponseClusterNodeValidatorItem[]> {
  const { data } = await axiosInstance.get(`/server/validator/${status}/${action}/${txid}`);

  const list = data.data as IResponseClusterNodeValidatorItem[];

  if (list) {
    list.forEach((item) => {
      item.operators.sort((a, b) => a.operator_id - b.operator_id);
    });
  }

  return list;
}

export async function filterValidatorStatus(
  status: IResponseValidatorStatusEnum,
  action: IResponseValidatorStatusEnum,
  txid: string
): Promise<IResponseClusterNodeValidatorItem[]> {
  const data = await queryValidatorStatus(status, action, txid);

  return data.filter((item) => item.generate_txid === txid);
}

export async function updateValidatorStatus(
  pubkey: string,
  action: IResponseValidatorStatusEnum,
  txid: string
): Promise<IResponseClusterNodeValidatorItem[]> {
  const { data } = await axiosInstance.post(`/server/validator/${pubkey}/${action}/${txid}`);

  return data.data;
}

export async function updateValidatorStatusBatch(
  validators: IResponseClusterNodeValidatorItem[],
  action: IResponseValidatorStatusEnum,
  txid: string
) {
  for (const validator of validators) {
    try {
      await updateValidatorStatus(validator.pubkey, action, txid);
    } catch (error) {
      console.error(`Error in updateValidatorStatusBatch: ${error}`);
    }
  }
}
