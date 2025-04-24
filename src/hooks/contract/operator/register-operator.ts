import { decodeEventLog } from 'viem';
import { useAccount, usePublicClient, useWriteContract } from 'wagmi';

import { useRegisterOperatorInfo } from '@/stores';
import { networkContract } from '@/config/contract';

export const useRegisterOperator = () => {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const { setNewOperatorId } = useRegisterOperatorInfo();
  const client = usePublicClient();

  const registerOperator = async (name: string, pk: any) => {
    const hash = await writeContractAsync({
      ...networkContract,
      functionName: 'registerOperator',
      args: [address!, name, pk],
    });

    const receipt = await client?.waitForTransactionReceipt({
      hash,
    });

    if (receipt?.logs && receipt.logs[0]) {
      const logs = decodeEventLog({
        ...networkContract,
        data: receipt.logs[0].data,
        topics: receipt.logs[0].topics,
      }) as any;

      console.log('Contract Receipt', receipt, logs);
      setNewOperatorId(logs.args.id);
    }
  };

  const registerOperatorEstimation = async (name: string, pk: any) => {
    const gasAmount = await client?.estimateContractGas({
      ...networkContract,
      functionName: 'registerOperator',
      args: [address!, name, pk],
    });
    console.log('===', gasAmount);

    // await client?.waitForTransactionReceipt({
    //   hash,
    // });
  };

  return {
    registerOperator,
    registerOperatorEstimation,
  };
};
