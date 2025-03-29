import { usePublicClient } from 'wagmi';

import { csmAccountingContract } from '@/config/contract';

export const useGetRequiredBondForNextKeys = () => {
  const client = usePublicClient();

  const getRequiredBondForNextKeys = async (nodeOperatorId: number, length: number) => {
    const result = await client?.readContract({
      ...csmAccountingContract,
      functionName: 'getRequiredBondForNextKeys',
      args: [nodeOperatorId, length],
    });

    console.log('🚀 ~ getRequiredBondForNextKeys ~ result:', result);

    return result as bigint;
  };

  const getBondAmountByKeysCount = async (keysCount: number) => {
    const result = await client?.readContract({
      ...csmAccountingContract,
      functionName: 'getBondAmountByKeysCount',
      args: [keysCount, 0],
    });

    return result as bigint;
  };

  return {
    getRequiredBondForNextKeys,
    getBondAmountByKeysCount,
  };
};
