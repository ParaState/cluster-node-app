import { enqueueSnackbar } from 'notistack';
import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';

import { IResponseCommonData } from '@/types';

const axiosInstance = axios.create({
  timeout: 60 * 1000,
});

export const requestInterceptor = (config: AxiosRequestConfig) => config;

axiosInstance.interceptors.request.use(requestInterceptor as any, (error) => Promise.reject(error));

export const responseIntercepter = async (res: AxiosResponse<IResponseCommonData>) => {
  if (res && res.status === 200) {
    switch (res.data.code) {
      case 200:
        return Promise.resolve(res);
      default:
        if (res?.data?.message) {
          enqueueSnackbar(res.data.message, { variant: 'error' });
        }
        return Promise.reject(res);
    }
  }

  return Promise.reject(res);
};

axiosInstance.interceptors.response.use(responseIntercepter, (error) => Promise.reject(error));

export default axiosInstance;
