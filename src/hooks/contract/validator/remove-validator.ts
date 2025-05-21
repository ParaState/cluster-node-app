import { usePublicClient, useWriteContract } from 'wagmi';

import { networkContract } from '@/config/contract';

export const useRemoveValidator = () => {
  const { writeContractAsync } = useWriteContract();

  const client = usePublicClient();

  const removeValidator = async (pks: string[]) => {
    const hash = await writeContractAsync({
      ...networkContract,
      functionName: 'removeValidator',
      args: [pks as `0x${string}`[]],
    });

    const receipt = await client?.waitForTransactionReceipt({
      hash,
    });

    if (receipt?.status === 'reverted') {
      throw new Error('Transaction reverted');
    }

    return receipt;
  };

  return {
    removeValidator,
  };
};
