import { useAccount, useSignMessage } from 'wagmi';

import { updateSignatureHeader } from '@/utils';

export function useAuthMessage() {
  const { address } = useAccount();
  const { signMessageAsync } = useSignMessage();

  const signAuthMessage = async () => {
    const now = Date.now();
    const deadline = Math.floor(now / 1000) + 24 * 60 * 60;

    const deadlineFormatted = new Date(deadline * 1000)
      .toISOString()
      .replace(/T/, ' ')
      .replace(/\..+/, '');

    const message = `welcome to safestake cluster node \nowner:${address} \ndeadline:${deadlineFormatted}`;

    try {
      const signature = await signMessageAsync({
        message,
      });

      updateSignatureHeader(signature, address!, deadline.toString());

      return signature;
    } catch (err) {
      console.error('Error signing message:', err);
      throw err;
    }
  };

  return {
    signAuthMessage,
  };
}
