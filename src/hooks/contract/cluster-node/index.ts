import { usePublicClient, useWriteContract } from 'wagmi';

import { isAddressZero } from '@/utils';
import { clusterNodeContract } from '@/config/contract';

export enum ClusterNodeActionFee {
  GENERATE_KEYS = 0,
  GENERATE_DEPOSIT_DATA = 1,
  GENERATE_EXIT_DATA = 2,
}

export const useClusterNode = () => {
  const { writeContractAsync } = useWriteContract();

  const client = usePublicClient();

  const getClusterNode = async (pubkey: string) => {
    // const pubkey = getClusterPubkey(address!);

    // if (!pubkey) {
    //   enqueueSnackbar('Please get public key first', { variant: 'error' });
    // }

    const result = await client?.readContract({
      ...clusterNodeContract,
      functionName: 'getClusterNode',
      args: [pubkey as any],
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
      confirmations: 1,
    });

    console.log('🚀 ~ registerClusterNode ~ receipt:', receipt);

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
    validatorCount: number,
    operatorIds: number[],
    depositAmount: bigint,
    withdrawAddress: `0x${string}`
  ) => {
    console.log(pubkey);
    console.log(validatorCount);
    console.log(operatorIds);
    console.log(depositAmount);
    console.log(withdrawAddress);

    const hash = await writeContractAsync({
      ...clusterNodeContract,
      functionName: 'generateDepositData',
      args: [pubkey as any, BigInt(validatorCount), operatorIds, depositAmount, withdrawAddress],
    });

    const receipt = await client?.waitForTransactionReceipt({
      hash,
    });

    return receipt;
  };

  const generateExitData = async (
    clusterNodePublicKey: string,
    validatorPubKeys: string[],
    activeEpoch: number
  ) => {
    const hash = await writeContractAsync({
      ...clusterNodeContract,
      functionName: 'generateExitData',
      args: [clusterNodePublicKey as any, validatorPubKeys as any, BigInt(activeEpoch)],
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
