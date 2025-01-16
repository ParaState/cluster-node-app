import { IResponseCommonList } from '@/types';

export interface IResponseUser {
  id: number;
  owner_address: string;
  validator_count: number;
  email: string;
  discord: string;
  enable: boolean;
  notification_enabled: boolean;
  last_notification_time: number;
  invite_address: string;
  createdAt: string;
  updatedAt: string;
  version: number;
}

export interface IResponseUsers extends IResponseCommonList<IResponseUser[]> {}
