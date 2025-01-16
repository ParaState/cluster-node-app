export interface IResponseSearchItem {
  id: string;
  pubkey: string;
  owner: string;
  type: 'operator' | 'validator';
  name: string;
}
