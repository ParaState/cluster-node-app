import { usePublicClient, useWriteContract } from 'wagmi';

import { isAddressZero } from '@/utils';
import { clusterNodeContract } from '@/config/contract';

import { useGlobalConfig } from '@/components/global-config-init';

export enum ClusterNodeActionFee {
  GENERATE_KEYS = 0,
  GENERATE_DEPOSIT_DATA = 1,
  GENERATE_EXIT_DATA = 2,
}

export const useClusterNode = () => {
  const { writeContractAsync } = useWriteContract();
  const { clusterNodeFeeTokenInfo } = useGlobalConfig();

  const client = usePublicClient();

  const getClusterNode = async (pubkey: string) => {
    // const pubkey = getClusterPubkey(address!);

    // if (!pubkey) {
    //   enqueueSnackbar('Please get public key first', { variant: 'error' });
    // }

    const result = await client?.readContract({
      ...clusterNodeContract,
      functionName: 'getClusterNode',
      args: [pubkey as `0x${string}`],
    });

    const isRegistered = !isAddressZero(result?.[0]);
    const owner = result?.[0];
    const active = result?.[1];

    console.log('🚀 ~ checkClusterPubkeyIsRegistered ~ result:', isRegistered, owner, active);

    return {
      owner,
      active,
      isRegistered,
    };
  };

  const registerClusterNode = async (pubkey: string) => {
    const hash = await writeContractAsync({
      ...clusterNodeContract,
      functionName: 'registerClusterNode',
      args: [pubkey as any],
    });

    const receipt = await client?.waitForTransactionReceipt({
      hash,
    });

    if (!receipt || receipt.status === 'reverted') {
      throw new Error('Transaction failed: registerClusterNode transaction was reverted');
    }

    return receipt;
  };

  const getActionFee = async (action: ClusterNodeActionFee) => {
    const result = await client?.readContract({
      ...clusterNodeContract,
      functionName: 'getActionFee',
      args: [BigInt(action)],
    });

    return result || 0n;
  };

  // bytes memory clusterNodePublicKey,
  // uint256 validatorCount,
  // uint32[] memory operatorIds,
  // uint256 depositAmount,
  // address withdrawAddress

  const generateDepositData = async (
    pubkey: string,
    owner: string,
    ownerPubkey: string,
    validatorCount: number,
    operatorIds: number[],
    depositAmount: bigint,
    withdrawAddress: `0x${string}`,
    currentFee: bigint
  ) => {
    console.group('generateDepositData');
    console.log(`pubkey`, pubkey);
    console.log(`owner`, owner);
    console.log(`validatorCount`, validatorCount);
    console.log(`operatorIds`, operatorIds);
    console.log(`depositAmount`, depositAmount);
    console.log(`withdrawAddress`, withdrawAddress);
    console.log(`currentFee`, currentFee);
    console.groupEnd();

    const hash = await writeContractAsync({
      ...clusterNodeContract,
      functionName: 'generateDepositData',
      args: [
        pubkey as `0x${string}`,
        owner as `0x${string}`,
        ownerPubkey as `0x${string}`,
        BigInt(validatorCount),
        operatorIds,
        depositAmount,
        withdrawAddress,
      ],
      ...(clusterNodeFeeTokenInfo.isNativeToken
        ? {
            value: currentFee,
          }
        : {}),
    });

    const receipt = await client?.waitForTransactionReceipt({
      hash,
    });

    if (!receipt || receipt.status === 'reverted') {
      throw new Error('Transaction failed: generateDepositData transaction was reverted');
    }

    return receipt;
  };

  const generateExitData = async (clusterNodePublicKey, validatorPubKeys, activeEpoch: number) => {
    const hash = await writeContractAsync({
      ...clusterNodeContract,
      functionName: 'generateExitData',
      args: [clusterNodePublicKey, validatorPubKeys, BigInt(activeEpoch)],
    });

    const receipt = await client?.waitForTransactionReceipt({
      hash,
    });

    return receipt;
  };

  // return {
  //   oldTokenBalance: oldTokenBalance?.result || 0n,
  //   newTokenBalance: newTokenBalance?.result || 0n,
  //   oldTokenAddress: oldTokenAddress?.result || '',
  //   oldTokenAllowance: oldTokenAllowance?.result || 0n,
  //   rate: rate?.result || 0n,
  //   refetch,
  //   approveAllowance,
  //   swap,
  // };

  return {
    getClusterNode,
    registerClusterNode,
    getActionFee,
    generateDepositData,
    generateExitData,
  };
};
