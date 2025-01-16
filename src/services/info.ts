import axiosInstance from '@/utils/axios';

export async function search(key: string) {
  try {
    const { data } = await axiosInstance.post(`/api/info/search`, {
      key,
    });

    return data.data;
  } catch (error: any) {
    console.error(`Error in search: ${error}`);
    throw error;
  }
}
