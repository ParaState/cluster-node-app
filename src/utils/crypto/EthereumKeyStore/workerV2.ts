import { decrypt } from '@chainsafe/bls-keystore';

import {
  WorkerMessage,
  WorkerSeedReuslt,
} from '@/utils/crypto/EthereumKeyStore/EthereumKeyStoreV2';

onmessage = async (event: MessageEvent) => {
  const { keystoreListIndexes, password, workerId } = event.data as WorkerMessage;
  console.log(`workerId=${workerId}`, `worker get ${keystoreListIndexes.length} keystore`);
  try {
    const results: WorkerSeedReuslt[] = [];

    for (let i = 0; i < keystoreListIndexes.length; i += 1) {
      console.time(`workerId=${workerId} decrypt`);
      const item = keystoreListIndexes[i];
      const { keystore } = item;
      // eslint-disable-next-line no-await-in-loop
      const decrypted = await decrypt(keystore as any, password);
      results.push({
        index: keystoreListIndexes[i].index,
        seed: decrypted,
      });
      console.timeEnd(`workerId=${workerId} decrypt`);
    }

    postMessage({
      success: true,
      results,
      workerId,
    });
  } catch (error) {
    postMessage({
      success: false,
      error,
      workerId,
    });
  }
};
