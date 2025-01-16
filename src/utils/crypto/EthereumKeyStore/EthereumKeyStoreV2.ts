import { groupBy } from 'lodash';
import Wallet from 'ethereumjs-wallet';

export interface WorkerMessage {
  keystoreListIndexes: { keystore: string; index: number }[];
  password: string;
  workerId: number;
}

export interface WorkerMessageResult {
  success: boolean;
  error?: any;
  workerId: number;
  results?: WorkerSeedReuslt[];
}

export interface WorkerSeedReuslt {
  index: number;
  seed: any;
}

export async function getPrivateKeyV2(keystoreList: string[], password: string = ''): Promise<any> {
  console.time('all workers decrypt');
  const idealMaxWorkers = Math.min(keystoreList.length, navigator.hardwareConcurrency || 1);
  const maxWorkers = idealMaxWorkers > 4 ? 4 : idealMaxWorkers;

  // let maxWorkers = Math.min(keystoreList.length, navigator?.hardwareConcurrency || 1);
  // maxWorkers = keystoreList.length > maxWorkers ? maxWorkers : keystoreList.length;
  // maxWorkers = 4;

  console.log('🚀 ~ getPrivateKeyV2Test ~ maxWorkers:', maxWorkers);

  const workers: Worker[] = [];

  const keystoreListWithIndex = keystoreList.map((keystore, index) => {
    return {
      keystore,
      index,
    };
  });

  const groupedKeystoreList = groupBy(keystoreListWithIndex, (item) => item.index % maxWorkers);

  for (let i = 0; i < maxWorkers; i += 1) {
    const items = groupedKeystoreList[i];
    const worker = new Worker(new URL('./workerV2.ts', import.meta.url), { type: 'module' });
    worker.postMessage({
      keystoreListIndexes: items,
      password,
      workerId: i,
    });
    workers.push(worker);
  }

  const results = (await Promise.all(
    workers.map(
      (worker) =>
        new Promise((resolve) => {
          worker.onmessage = (event) => {
            resolve(event.data);
          };
        })
    )
  )) as WorkerMessageResult[];

  if (results.some((key) => key.success === false)) {
    throw results.find((key) => key.success === false)?.error;
  }

  const allResults = results.map((item) => item.results).flat();

  const sortedKeys = allResults.sort((a, b) => a!.index - b!.index);

  const keys = sortedKeys.map((item) => item!.seed);

  console.timeEnd('all workers decrypt');

  // console.log('🚀 ~ getPrivateKeyV2Test ~ keys:', keys);

  const wallets = keys.map((key) => new Wallet(Buffer.from(key)));

  const privateKeys = wallets.map((wallet) => wallet.getPrivateKey().toString('hex'));
  // pubkey is not from wallet, it's from keystore
  const publicKeys = keystoreList.map((keystore: any) => keystore.pubkey);

  return {
    privateKeys,
    publicKeys,
  };
}

export async function getPrivateKeyV2Test(
  keystoreList: string[],
  password: string = ''
): Promise<any> {
  console.time('all workers decrypt');
  const idealMaxWorkers = Math.min(keystoreList.length, navigator.hardwareConcurrency || 1);
  const maxWorkers = idealMaxWorkers > 4 ? 4 : idealMaxWorkers;

  // let maxWorkers = Math.min(keystoreList.length, navigator?.hardwareConcurrency || 1);
  // maxWorkers = keystoreList.length > maxWorkers ? maxWorkers : keystoreList.length;
  // maxWorkers = 4;

  console.log('🚀 ~ getPrivateKeyV2Test ~ maxWorkers:', maxWorkers);

  const workers: Worker[] = [];

  const keystoreListWithIndex = keystoreList.map((keystore, index) => {
    return {
      keystore,
      index,
    };
  });

  const groupedKeystoreList = groupBy(keystoreListWithIndex, (item) => item.index % maxWorkers);

  for (let i = 0; i < maxWorkers; i += 1) {
    const items = groupedKeystoreList[i];
    const worker = new Worker(new URL('./workerV2.ts', import.meta.url), { type: 'module' });
    worker.postMessage({
      keystoreListIndexes: items,
      password,
      workerId: i,
    });
    workers.push(worker);
  }

  const results = (await Promise.all(
    workers.map(
      (worker) =>
        new Promise((resolve) => {
          worker.onmessage = (event) => {
            resolve(event.data);
          };
        })
    )
  )) as WorkerMessageResult[];

  workers.forEach((worker) => {
    worker.terminate();
  });

  if (results.some((key) => key.success === false)) {
    throw results.find((key) => key.success === false)?.error;
  }

  const allResults = results.map((item) => item.results).flat();

  const sortedKeys = allResults.sort((a, b) => a!.index - b!.index);

  const keys = sortedKeys.map((item) => item!.seed);

  console.timeEnd('all workers decrypt');

  // console.log('🚀 ~ getPrivateKeyV2Test ~ keys:', keys);

  const wallets = keys.map((key) => new Wallet(Buffer.from(key)));

  const privateKeys = wallets.map((wallet) => wallet.getPrivateKey().toString('hex'));
  // pubkey is not from wallet, it's from keystore
  const publicKeys = keystoreList.map((keystore: any) => keystore.pubkey);

  return {
    privateKeys,
    publicKeys,
  };
}
