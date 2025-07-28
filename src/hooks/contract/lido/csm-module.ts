import { usePublicClient, useWriteContract } from 'wagmi';
import { TOKENS, DepositDataKey } from '@lidofinance/lido-csm-sdk';
import { zeroAddress, decodeEventLog, encodeEventTopics, TransactionReceipt } from 'viem';

import { useLidoSDK } from '@/wagmi/lido-sdk';
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
    from: string,
    nodeOperatorId: number,
    keysCount: number,
    publicKeys: string,
    signatures: string,
    needAmount: bigint
  ) => {
    const hash = await writeContractAsync({
      ...csmModuleContract,
      functionName: 'addValidatorKeysETH',
      args: [from, nodeOperatorId, keysCount, publicKeys, signatures],
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

export const useLidoSDKAddNodeOperator = () => {
  const client = usePublicClient();
  const { csm } = useLidoSDK();

  // https://hoodi.etherscan.io/address/0x5553077102322689876A6AdFd48D75014c28acfb
  const addNodeOperator = async (depositData: DepositDataKey[], amount: bigint) => {
    const result = await csm.permissionlessGate.addNodeOperator({
      token: TOKENS.eth,
      amount,
      depositData,
      rewardsAddress: zeroAddress,
      managerAddress: zeroAddress,
      extendedManagerPermissions: false,
      referrer: zeroAddress,
    });

    const receipt = await client?.waitForTransactionReceipt({
      hash: result.hash,
    });

    if (!receipt || receipt.status === 'reverted') {
      throw new Error('Transaction failed');
    }

    const nodeOperatorId = result.result?.nodeOperatorId;
    // console.log('🚀 ~ addNodeOperator ~ nodeOperatorId:', nodeOperatorId);

    return {
      receipt,
      nodeOperatorId,
    };
  };

  return {
    addNodeOperator,
  };
};

export const useLidoSDKAddKeys = () => {
  const client = usePublicClient();
  const { csm } = useLidoSDK();

  const addKeys = async (
    depositData: DepositDataKey[],
    nodeOperatorId: number,
    needAmount: bigint
  ) => {
    const result = await csm.keys.addKeys({
      nodeOperatorId: BigInt(nodeOperatorId),
      token: TOKENS.eth,
      amount: needAmount,
      depositData,
    });

    const receipt = await client?.waitForTransactionReceipt({
      hash: result.hash,
    });

    if (!receipt || receipt.status === 'reverted') {
      throw new Error('Transaction failed');
    }

    return receipt;
  };

  return {
    addKeys,
  };
};
