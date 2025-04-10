import { usePublicClient, useWriteContract } from 'wagmi';
import { zeroAddress, decodeEventLog, encodeEventTopics, TransactionReceipt } from 'viem';

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

export const useAddNodeOperatorETH = () => {
  const client = usePublicClient();
  const { writeContractAsync } = useWriteContract();

  const addNodeOperatorETH = async (
    keysCount: number,
    publicKeys: string,
    signatures: string,
    amount: bigint
  ) => {
    const hash = await writeContractAsync({
      ...csmModuleContract,
      functionName: 'addNodeOperatorETH',
      args: [
        keysCount,
        publicKeys,
        signatures,
        {
          managerAddress: zeroAddress,
          rewardAddress: zeroAddress,
          extendedManagerPermissions: false,
        },
        [],
        zeroAddress,
      ],
      value: amount,
    });

    const receipt = await client?.waitForTransactionReceipt({
      hash,
    });

    if (!receipt || receipt.status === 'reverted') {
      throw new Error('Transaction failed');
    }

    return receipt;
  };

  const decodeNodeOperatorAddedEvent = (receipt?: TransactionReceipt) => {
    const topics = encodeEventTopics({
      abi: csmModuleContract.abi,
      eventName: 'NodeOperatorAdded',
    });

    const topic = topics[0];

    const nodeOperatorAddedEvent = receipt?.logs
      .filter((log) => {
        return (
          log.address.toLowerCase() === csmModuleContract.address.toLowerCase() &&
          log.topics[0] === topic
        );
      })
      .map((log) => {
        const decodedLog = decodeEventLog({
          abi: csmModuleContract.abi,
          data: log.data,
          topics: log.topics,
          eventName: 'NodeOperatorAdded',
        });

        const args = decodedLog.args as unknown as {
          nodeOperatorId: number;
          managerAddress: `0x${string}`;
          rewardAddress: `0x${string}`;
        };

        return {
          nodeOperatorId: Number(args.nodeOperatorId),
          managerAddress: args.managerAddress,
          rewardAddress: args.rewardAddress,
        };
      })[0];

    return nodeOperatorAddedEvent;
  };

  return {
    addNodeOperatorETH,
    decodeNodeOperatorAddedEvent,
  };
};
