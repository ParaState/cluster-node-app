import crypto from 'crypto';
// import { scrypt } from 'scrypt-js';
import Wallet from 'ethereumjs-wallet';
import { sha256, keccak256 } from 'ethereumjs-util';

interface V4Keystore {
  crypto: {
    kdf: {
      function: string;
      params: {
        dklen: number;
        n: number;
        r: number;
        p: number;
        salt: string;
      };
      message: string;
    };
    checksum: {
      function: string;
      params: any;
      message: string;
    };
    cipher: {
      function: string;
      params: {
        iv: string;
      };
      message: string;
    };
  };
  description: string;
  pubkey: string;
  path: string;
  uuid: string;
  version: number;
}

/**
 * Decrypt private key from key store data
 * Supports key store versions: v1, v3, v4
 *
 * Example of usage (Node env):
 *
 *  const keyStoreFilePath = path.join(process.cwd(), 'validator_keys', 'keystore.json');
 *  const keyStoreString: string = fs.readFileSync(keyStoreFilePath).toString();
 *  const keyStoreData = JSON.parse(keyStoreString);
 *  const keyStore = new EthereumKeyStore(keyStoreData);
 *  const password = 'testtest';
 *  console.log('Private Key:', await keyStore.getPrivateKey(password));
 */
class EthereumKeyStore {
  private readonly keyStoreData: any;

  private privateKey: string = '';

  private wallet: Wallet | undefined;

  /**
   * Receive key store data from string or parsed JSON
   * @param keyStoreData
   */
  constructor(keyStoreData: string | any) {
    if (!keyStoreData) {
      throw new Error('Key store data should be JSON or string');
    }
    if (typeof keyStoreData !== 'string') {
      this.keyStoreData = keyStoreData;
    } else {
      this.keyStoreData = JSON.parse(String(keyStoreData));
    }
    if (!this.keyStoreData.version) {
      throw new Error('Invalid file type.');
    }
  }

  getPublicKey() {
    if (this.keyStoreData) {
      // eslint-disable-next-line default-case
      switch (this.keyStoreData.version ?? this.keyStoreData.Version) {
        case 1:
          return this.keyStoreData.Address;
        case 3:
          return this.keyStoreData.id;
        case 4:
          return this.keyStoreData.pubkey;
      }
    }
    return '';
  }

  /**
   * Decrypt private key using user password
   * @param password
   */
  async getPrivateKey(password: string = ''): Promise<string> {
    // In case private key exist we return it
    if (this.privateKey) return this.privateKey;
    // eslint-disable-next-line default-case
    switch (this.keyStoreData.version) {
      case 1:
        this.wallet = await Wallet.fromV1(this.keyStoreData, password);
        break;
      case 3:
        this.wallet = await Wallet.fromV3(this.keyStoreData, password, true);
        break;
      case 4:
        this.wallet = await this.fromV4(this.keyStoreData, password);
        break;
    }
    if (this.wallet) {
      this.privateKey = this.wallet.getPrivateKey().toString('hex');
      if (!this.privateKey) {
        throw new Error('Invalid password');
      }
    }
    return this.privateKey;
  }

  /**
   * Import a wallet (Version 4 of the Ethereum wallet format).
   *
   * @param input A JSON serialized string, or an object representing V3 Keystore.
   * @param password The keystore password.
   */
  public async fromV4(input: string | V4Keystore, password: string): Promise<Wallet> {
    const json: V4Keystore = typeof input === 'object' ? input : JSON.parse(input);

    if (json.version !== 4) {
      throw new Error('Not a V4 wallet');
    }

    let derivedKey: Uint8Array;
    let kdfParams: any;
    if (json.crypto.kdf.function === 'scrypt') {
      console.time('🚀 ~ EthereumKeyStore ~ fromV4 ~ scrypt:');

      kdfParams = json.crypto.kdf.params;

      const worker = new Worker(new URL('./worker.ts', import.meta.url), { type: 'module' });
      worker.postMessage({
        password,
        kdfParams: json.crypto.kdf.params,
      });

      const key: any = await new Promise((resolve) => {
        worker.onmessage = (event) => {
          resolve(event.data);
        };
      });

      // const key = await scryptPbkdf.scrypt(password, Buffer.from(kdfParams.salt, 'hex'), kdfParams.dklen, scryptParams);
      derivedKey = key;
      // derivedKey = await scrypt(Buffer.from(password), Buffer.from(kdfParams.salt, 'hex'), kdfParams.n, kdfParams.r, kdfParams.p, kdfParams.dklen);
      console.timeEnd('🚀 ~ EthereumKeyStore ~ fromV4 ~ scrypt:');
      worker.terminate();
    } else if (json.crypto.kdf.function === 'pbkdf2') {
      console.time('🚀 ~ EthereumKeyStore ~ fromV4 ~ pbkdf2:');
      kdfParams = json.crypto.kdf.params;

      if (kdfParams.prf !== 'hmac-sha256') {
        throw new Error('Unsupported parameters to PBKDF2');
      }

      derivedKey = crypto.pbkdf2Sync(
        Buffer.from(password),
        Buffer.from(kdfParams.salt, 'hex'),
        kdfParams.c,
        kdfParams.dklen,
        'sha256'
      );
      console.timeEnd('🚀 ~ EthereumKeyStore ~ fromV4 ~ pbkdf2:');
    } else {
      throw new Error('Unsupported key derivation scheme');
    }

    const ciphertext = Buffer.from(json.crypto.cipher.message, 'hex');
    const checksumBuffer = Buffer.concat([Buffer.from(derivedKey.slice(16, 32)), ciphertext]);
    const hashFunctions: Record<string, any> = {
      keccak256,
      sha256,
    };
    const hashFunction: any = hashFunctions[json.crypto.checksum.function];
    const mac: Buffer = hashFunction(checksumBuffer);
    if (mac.toString('hex') !== json.crypto.checksum.message) {
      throw new Error('Invalid password');
    }

    const decipher = crypto.createDecipheriv(
      json.crypto.cipher.function,
      derivedKey.slice(0, 16),
      Buffer.from(json.crypto.cipher.params.iv, 'hex')
    );
    const seed: Buffer = this.runCipherBuffer(decipher, ciphertext);
    return new Wallet(seed);
  }

  /**
   * @param cipher
   * @param data
   */
  // eslint-disable-next-line class-methods-use-this
  protected runCipherBuffer(cipher: crypto.Cipher | crypto.Decipher, data: Buffer): Buffer {
    return Buffer.concat([cipher.update(data), cipher.final()]);
  }

  /**
   * Convert byte array to string
   * @param byteArray
   */
  static toHexString(byteArray: Uint8Array) {
    return Array.from(byteArray, (byte: number) => {
      // eslint-disable-next-line no-bitwise
      return `0${(byte & 0xff).toString(16)}`.slice(-2);
    }).join('');
  }
}

export default EthereumKeyStore;
