import axiosInstance from '@/utils/axios';

import { IResponseClaimRun, IResponseClaimPrepare, IResponseClaimRecordItemList } from '../types';

export async function getClaimsRecord(body): Promise<IResponseClaimRecordItemList> {
  try {
    const { data } = await axiosInstance.post(`/api/v1/claims`, body);

    return data.data;
  } catch (error: any) {
    console.error(`Error in getClaimsRecord: ${error}`);
    throw error;
  }
}

export async function claimPrepare(body): Promise<IResponseClaimPrepare> {
  try {
    const { data } = await axiosInstance.post(`/api/claim/prepare`, body);

    return data.data;
  } catch (error: any) {
    console.error(`Error in claimPrepare: ${error}`);
    throw error;
  }
}

export async function claimRun(body): Promise<IResponseClaimRun> {
  try {
    const { data } = await axiosInstance.post(`/api/claim/run`, body);
    return data.data;
  } catch (error: any) {
    console.error(`Error in claimRun: ${error}`);
    throw error;
  }
}
