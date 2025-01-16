import { ec } from 'elliptic';
// import { Buffer } from 'buffer';
import crypto, { CipherKey, BinaryLike } from 'crypto';

import { IShares } from '@/utils/crypto/Threshold';

const sha256 = (msg: any) => {
  const hasher = crypto.createHash('sha256');
  hasher.update(msg);
  return hasher.digest();
};

// const stringToHex = (str: string) => {
//   const raw = atob(str);
//   let result = '';
//   for (let i = 0; i < raw.length; i += 1) {
//     const hex = raw.charCodeAt(i).toString(16);
//     result += hex.length === 2 ? hex : `0${hex}`;
//   }
//   return result.toLowerCase();
// };
export interface EncryptShare {
  operatorPublicKey: string;
  privateKey: string;
  publicKey: string;
}

export default class Encryption {
  private readonly operators: string[];

  private readonly shares: IShares[];

  constructor(operators: string[], shares: IShares[]) {
    this.operators = operators;
    this.shares = shares;
  }

  encrypt() {
    const encryptedShares: EncryptShare[] = [];
    // eslint-disable-next-line new-cap
    const EC = new ec('secp256k1');
    Object.keys(this.operators).forEach((operator) => {
      // const pk = EC.keyFromPublic(stringToHex(this.operators[operator]), 'hex').getPublic();
      const tempKey = this.operators[operator];
      const fixedKey = tempKey.startsWith('0x') ? tempKey.slice(2) : tempKey;
      // console.log(fixedKey);
      const pk = EC.keyFromPublic(fixedKey, 'hex').getPublic();
      const other_key = EC.genKeyPair();
      const point = pk.mul(other_key.getPrivate());
      const buffer = Buffer.alloc(64);
      const xBuffer = point.getX().toArrayLike(Buffer);
      const yBuffer = point.getY().toArrayLike(Buffer);
      xBuffer.copy(buffer, 32 - xBuffer.length);
      yBuffer.copy(buffer, 32 + 32 - yBuffer.length);
      // AES encryption
      const key: CipherKey = sha256(buffer).slice(0, 16);
      const iv: BinaryLike = crypto.randomBytes(12);
      const cipher = crypto.createCipheriv('aes-128-gcm', key, iv);
      const ct = Buffer.concat([
        cipher.update(Buffer.from(this.shares[operator].privateKey.slice(2), 'hex')),
        cipher.final(),
      ]);
      const authTag = cipher.getAuthTag();
      const aes_ct = Buffer.concat([iv, ct, authTag]);
      const elgamal_ct = Buffer.concat([
        Buffer.from(other_key.getPublic().encodeCompressed()),
        aes_ct,
      ]);
      const encryptedShare: EncryptShare = {
        operatorPublicKey: this.operators[operator],
        privateKey: String(elgamal_ct.toString('base64')),
        publicKey: this.shares[operator].publicKey,
      };
      encryptedShares.push(encryptedShare);
      return encryptedShare;
    });
    return encryptedShares;
  }
}
