import { zeroAddress } from 'viem';

export const longStringShorten = (key?: string, len: number = 6) => {
  if (!key) return '';
  const result = `${key.slice(0, len)}...${key.slice(key.length - len, key.length)}`;
  return result;
};

export const hexToBase64 = (hexstring: string) => {
  const str = hexstring.startsWith('0x') ? hexstring.slice(2) : hexstring;

  return btoa(
    str
      .match(/\w{2}/g)!
      .map((a) => String.fromCharCode(parseInt(a, 16)))
      .join('')
  );
};

export const formatPkFromBase64 = (pk: string) => {
  const hex = Buffer.from(pk, 'base64').toString('hex');
  return hex.startsWith('0x') ? hex : `0x${hex}`;
};

export const validatePublicKeyHex = (pk: string) => {
  if (pk.length !== 68) {
    console.log('Invalid public key hex length');
    return false;
  }

  return true;
};

export const addPrefix0x = (str: string) => {
  return str.startsWith('0x') ? str : `0x${str}`;
};

export const isAddressZero = (address?: string) => {
  return address?.toLowerCase() === zeroAddress.toLowerCase();
};
