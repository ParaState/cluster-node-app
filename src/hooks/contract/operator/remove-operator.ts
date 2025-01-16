import { usePublicClient, useWriteContract } from 'wagmi';

import { registryContract } from '@/config/contract';

export const useRemoveOperator = () => {
  // const { account } = useAccount();
  const { writeContractAsync } = useWriteContract();

  const client = usePublicClient();

  const removeOperator = async (id: any) => {
    const hash = await writeContractAsync({
      ...registryContract,
      functionName: 'removeOperator',
      args: [id],
    });

    await client?.waitForTransactionReceipt({
      hash,
    });

    //  ex
    // const receipt = await client?.waitForTransactionReceipt({
    //   hash,
    // });
    // if (receipt?.logs && receipt.logs[0]) {
    //   console.log(
    //     'receipt.logs[0].args ',
    //     receipt.logs[0],
    //     receipt.logs[0].data,
    //     receipt.logs[0].topics
    //   );
    //   const logs = decodeEventLog({
    //     ...registryContract,
    //     data: receipt.logs[0].data,
    //     topics: receipt.logs[0].topics,
    //   });
    //   console.log('Contract Receipt', receipt, logs);
    // }
  };

  return {
    removeOperator,
  };
};
