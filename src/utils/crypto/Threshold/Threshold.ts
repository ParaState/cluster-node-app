import bls from 'bls-eth-wasm/browser';
import { SecretKeyType } from 'bls-eth-wasm';

bls.init(bls.BLS12_381);
// if (typeof window !== 'undefined') {
//   bls = require('bls-eth-wasm/browser');
//   bls.init(bls.BLS12_381);
// } else {
//   bls = require('bls-eth-wasm');
// }

export interface IShares {
  privateKey: string;
  publicKey: string;
  id?: any;
}

export interface ISharesKeyPairs {
  validatorPrivateKey: string;
  validatorPublicKey: string;
  shares: IShares[];
}

/**
 * Example of usage:
 *
 *  const threshold: Threshold = new Threshold();
 *  threshold.create('45df68ab75bb7ed1063b7615298e81c1ca1b0c362ef2e93937b7bba9d7c43a94').then((s) => {
 *    console.log(s);
 *  });
 */
class Threshold {
  protected validatorPrivateKey: any;

  protected validatorPublicKey: any;

  protected validatorShares: Array<any> = [];

  protected validatorSigKey: any;

  protected threshold: number;

  protected sharesNumber: number;

  // defualt is 3 of 4,
  constructor(total: number, threhold: number) {
    this.sharesNumber = total;
    this.threshold = threhold;
  }

  /**
   * Generate keys and return promise
   */
  async create(privateKey: string, operator_ids: number[]): Promise<ISharesKeyPairs> {
    return new Promise((resolve, reject) => {
      try {
        // bls.init(bls.BLS12_381).then(() => {
        const msk: any[] = [];
        const mpk: any[] = [];

        // master key Polynomial
        this.validatorPrivateKey = bls.deserializeHexStrToSecretKey(privateKey);
        this.validatorPublicKey = this.validatorPrivateKey.getPublicKey();

        msk.push(this.validatorPrivateKey);
        mpk.push(this.validatorPublicKey);

        // construct poly
        for (let i = 1; i < this.threshold; i += 1) {
          const sk: SecretKeyType = new bls.SecretKey();
          sk.setByCSPRNG();
          msk.push(sk);
          const pk = sk.getPublicKey();
          mpk.push(pk);
        }

        // evaluate shares - starting from 1 because 0 is master key
        for (let i = 1; i <= this.sharesNumber; i += 1) {
          const id = new bls.Id();
          id.setInt(operator_ids[i - 1]);
          const shareSecretKey = new bls.SecretKey();
          shareSecretKey.share(msk, id);

          const sharePublicKey = new bls.PublicKey();
          sharePublicKey.share(mpk, id);

          this.validatorShares.push({
            privateKey: `0x${shareSecretKey.serializeToHexStr()}`,
            publicKey: `0x${sharePublicKey.serializeToHexStr()}`,
            id,
          });
        }

        const response: ISharesKeyPairs = {
          validatorPrivateKey: `0x${this.validatorPrivateKey.serializeToHexStr()}`,
          validatorPublicKey: `0x${this.validatorPublicKey.serializeToHexStr()}`,
          shares: this.validatorShares,
        };
        resolve(response);
        // });
      } catch (error: any) {
        reject(error);
      }
    });
  }
}

export default Threshold;
