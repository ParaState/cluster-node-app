import axiosInstance from '@/utils/axios';
import { getPerformanceParams } from '@/utils/calc';

import {
  IResponseOperator,
  IResponseOperators,
  PerformanceTypeEnum,
  IResponseOperatorMapsList,
  IResponseValidatorHissList,
  IResponseOperationReportList,
  IResponseOperatorPerformance,
} from '@/types';

export async function fetchOperators(body: any): Promise<IResponseOperators> {
  try {
    const { data } = await axiosInstance.post(`/api/v1/operators`, body);

    return data.data;
  } catch (error: any) {
    console.error(`Error in getOperators: ${error}`);
    throw error;
  }
}

export async function fetchOperator(operatorId: string): Promise<IResponseOperator> {
  try {
    const { data } = await axiosInstance.post(`/api/v1/operator/${operatorId}`);

    return data.data;
  } catch (error: any) {
    console.error(`Error in getOperators: ${error}`);
    throw error;
  }
}

export async function fetchOperatorByPk(pk: string): Promise<IResponseOperator> {
  try {
    const body = {
      pag: {
        offset: 0,
        limit: 1,
      },
      filter: {
        pk,
      },
      sort: {
        id: 1,
      },
    };

    const { data } = await axiosInstance.post(`/api/v1/operators`, body);

    return data?.data?.rows?.at(0);
  } catch (error: any) {
    console.error(`Error in getOperators: ${error}`);
    throw error;
  }
}

export async function findOperatorExist(pk: string): Promise<boolean> {
  try {
    const body = {
      pag: {
        offset: 0,
        limit: 1,
      },
      filter: {
        pk,
      },
    };
    const { data } = await axiosInstance.post(`/api/v1/operators`, body);

    return data.data.count > 0;
  } catch (error: any) {
    console.error(`Error in findOperatorExist: ${error}`);
    return false;
  }
}

export async function fetchOperatorMaps(body: any): Promise<IResponseOperatorMapsList> {
  try {
    const { data } = await axiosInstance.post(`/api/v1/operatorMaps`, body);

    return data.data;
  } catch (error: any) {
    console.error(`Error in getValidators: ${error}`);
    throw error;
  }
}

export async function fetchOperatorPerformance(
  filter: any,
  performance: PerformanceTypeEnum
): Promise<IResponseOperatorPerformance[]> {
  try {
    const body = getPerformanceParams(filter, performance);

    const { data } = await axiosInstance.post(`/api/v1/performance/operator`, body);

    return data.data;
  } catch (error: any) {
    console.error(`Error in fetchOperatorPerformance: ${error}`);
    throw error;
  }
}

export async function fetchOperatorHiss(body): Promise<IResponseValidatorHissList> {
  try {
    const { data } = await axiosInstance.post(`/api/v1/operatorHiss`, body);

    return data.data;
  } catch (error: any) {
    console.error(`Error in getValidators: ${error}`);
    throw error;
  }
}

export async function fetchOperationHiss(body) {
  try {
    const { data } = await axiosInstance.post(`/api/v1/operationHiss`, body);

    return data.data;
  } catch (error: any) {
    console.error(`Error in getValidators: ${error}`);
    throw error;
  }
}

export async function fetchOperationReports(body): Promise<IResponseOperationReportList> {
  try {
    const { data } = await axiosInstance.post(`/api/v1/operationReports`, body);

    return data.data;
  } catch (error: any) {
    console.error(`Error in fetchOperationReports: ${error}`);
    throw error;
  }
}
