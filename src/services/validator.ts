import axiosInstance from '@/utils/axios';
import { getPerformanceParams } from '@/utils/calc';

import {
  IResponseValidators,
  PerformanceTypeEnum,
  IResponseValidatorHissList,
  IResponseOperatorPerformance,
} from '@/types';

export async function fetchValidators(body: any): Promise<IResponseValidators> {
  try {
    const { data } = await axiosInstance.post(`/api/v1/validators`, body);

    return data.data;
  } catch (error: any) {
    console.error(`Error in getValidators: ${error}`);
    throw error;
  }
}

export async function fetchValidatorHiss(body): Promise<IResponseValidatorHissList> {
  try {
    const { data } = await axiosInstance.post(`/api/v1/validatorHiss`, body);

    return data.data;
  } catch (error: any) {
    console.error(`Error in getValidators: ${error}`);
    throw error;
  }
}

export async function fetchValidatorPerformance(
  filter: any,
  performance: PerformanceTypeEnum
): Promise<IResponseOperatorPerformance[]> {
  try {
    const body = getPerformanceParams(filter, performance);

    const { data } = await axiosInstance.post(`/api/v1/performance/validator`, body);

    return data.data;
  } catch (error: any) {
    console.error(`Error in fetchOperatorPerformance: ${error}`);
    throw error;
  }
}

export async function voluntaryExit(body: any): Promise<void> {
  try {
    const { data } = await axiosInstance.post(`/api/beacon/voluntary_exits`, body);

    return data.data;
  } catch (error: any) {
    console.error(`Error in voluntaryExit: ${error}`);
    throw error;
  }
}
