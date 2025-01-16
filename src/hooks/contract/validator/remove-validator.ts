import { usePublicClient, useWriteContract } from 'wagmi';

import { networkContract } from '@/config/contract';

// export const useRemoveValidator = (pk: string) => {
//   // const { account } = useAccount();

//   // console.log(pk);
//   // return useWriteContract({
//   //   ...networkContract,
//   //   functionName: 'removeValidator',
//   //   args: [pk],
//   // } as any);

// };

export const useRemoveValidator = () => {
  // const { account } = useAccount();
  const { writeContractAsync } = useWriteContract();

  const client = usePublicClient();

  const removeValidator = async (pks: string[]) => {
    const hash = await writeContractAsync({
      ...networkContract,
      functionName: 'removeValidator',
      args: [pks as `0x${string}`[]],
    });

    await client?.waitForTransactionReceipt({
      hash,
    });
  };

  return {
    removeValidator,
  };
};
