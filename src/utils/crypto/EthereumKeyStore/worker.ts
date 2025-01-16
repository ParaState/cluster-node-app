import { decrypt } from '@chainsafe/bls-keystore';

onmessage = async (event: MessageEvent) => {
  const { keystore, password } = event.data;

  const seed = await decrypt(keystore as any, password);

  postMessage(seed);
};
