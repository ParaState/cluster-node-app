import axiosInstance from '@/utils/axios';

import { IResponseUsers } from '@/types';

export async function bind(body: any, sig: string) {
  try {
    const { data } = await axiosInstance.post(`/api/user/bind`, body, {
      headers: {
        'Content-Type': 'application/json',
        Signature: sig,
      },
    });

    return data.data;
  } catch (error: any) {
    console.error(`Error in bind: ${error}`);
    throw error;
  }
}

export async function fetchUsers(body: any): Promise<IResponseUsers> {
  try {
    const { data } = await axiosInstance.post(`/api/v1/users`, body);

    return data.data;
  } catch (error: any) {
    console.error(`Error in fetchUsers: ${error}`);
    throw error;
  }
}
