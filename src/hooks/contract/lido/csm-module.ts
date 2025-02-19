import { usePublicClient, useWriteContract } from 'wagmi';

import { csmModuleContract } from '@/config/contract';

export const useGetNodeOperator = () => {
  const client = usePublicClient();

  const getNodeOperator = async (nodeOperatorId: number) => {
    const result = await client?.readContract({
      ...csmModuleContract,
      functionName: 'getNodeOperator',
      args: [nodeOperatorId],
    });

    return result as {
      totalAddedKeys: number;
      totalWithdrawnKeys: number;
      totalDepositedKeys: number;
      totalVettedKeys: number;
      stuckValidatorsCount: number;
      depositableValidatorsCount: number;
      targetLimit: number;
      targetLimitMode: number;
      totalExitedKeys: number;
      enqueuedCount: number;
      managerAddress: string;
      proposedManagerAddress: string;
      rewardAddress: string;
      proposedRewardAddress: string;
      extendedManagerPermissions: boolean;
    };
  };

  return {
    getNodeOperator,
  };
};

export const useAddValidatorKeysETH = () => {
  const client = usePublicClient();
  const { writeContractAsync } = useWriteContract();

  const addValidatorKeysETH = async (
    nodeOperatorId: number,
    keysCount: number,
    publicKeys: string,
    signatures: string,
    needAmount: bigint
  ) => {
    const hash = await writeContractAsync({
      ...csmModuleContract,
      functionName: 'addValidatorKeysETH',
      args: [nodeOperatorId, keysCount, publicKeys, signatures],
      value: needAmount,
    });

    const receipt = await client?.waitForTransactionReceipt({
      hash,
    });

    console.log('🚀 ~ useAddValidatorKeysETH ~ receipt:', receipt);

    return receipt;
  };

  return {
    addValidatorKeysETH,
  };
};
