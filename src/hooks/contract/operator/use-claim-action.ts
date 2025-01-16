import { usePublicClient, useWriteContract } from 'wagmi';

import { networkContract } from '@/config/contract';

export const useClaimAction = () => {
  // const { account } = useAccount();
  const { writeContractAsync } = useWriteContract();

  const client = usePublicClient();

  const accountClaimFee = async (body: any) => {
    const hash = await writeContractAsync({
      ...networkContract,
      functionName: 'accountClaimFee',
      args: body as any,
    });
    await client?.waitForTransactionReceipt({
      hash,
    });
  };

  return {
    accountClaimFee,
  };
};
