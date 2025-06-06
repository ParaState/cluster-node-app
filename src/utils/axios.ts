import { enqueueSnackbar } from 'notistack';
import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';

import { IResponseCommonData } from '@/types';

import { getSignatureHeader } from './auth';

const axiosInstance = axios.create({
  timeout: 60 * 1000,
});

export const requestInterceptor = (config: AxiosRequestConfig) => {
  const {
    'v-signature': signature,
    'v-owner': owner,
    'v-deadline': deadline,
  } = getSignatureHeader();

  if (signature && owner && deadline && config.headers) {
    config.headers['v-signature'] = signature;
    config.headers['v-owner'] = owner;
    config.headers['v-deadline'] = deadline;
  }

  return config;
};

axiosInstance.interceptors.request.use(requestInterceptor as any, (error) => Promise.reject(error));

export const responseInterceptor = async (res: AxiosResponse<IResponseCommonData>) => {
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

axiosInstance.interceptors.response.use(responseInterceptor, (error) => Promise.reject(error));

export default axiosInstance;
