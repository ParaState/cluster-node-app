import { useCallback } from 'react';
import { usePublicClient, useWriteContract } from 'wagmi';

import { useTokenBalance, useTokenBalanceWithAddress } from '@/hooks/contract';

import { config } from '@/config';
import { erc20Contract } from '@/config/contract';

export const useTokenApproval = () => {
  const { allowance, balance, refetch } = useTokenBalance();

  const { writeContractAsync } = useWriteContract();

  const client = usePublicClient();

  const approveAllowance = useCallback(
    async (
      amount: bigint
    ): Promise<{
      success: boolean;
      allowance: bigint;
      isTokenEnough: boolean;
    }> => {
      console.group('approveAllowance');
      console.log('user tokenBalance:', balance.toString());
      console.log('need amount:', amount.toString());
      console.log('current allowance:', allowance.toString());
      console.log('need approve', allowance < amount);
      console.log('allowance address:', config.contractAddress.network);
      console.groupEnd();

      if (allowance >= amount) {
        return {
          isTokenEnough: true,
          success: true,
          allowance,
        };
      }

      const hash = await writeContractAsync({
        ...erc20Contract,
        functionName: 'approve',
        args: [config.contractAddress.network, amount],
      });

      console.log(hash);

      const reuslt = await client?.waitForTransactionReceipt({
        hash,
      });

      console.log(reuslt);

      const { data } = await refetch();
      const [newAllowance] = data || [];

      const isTokenEnough = newAllowance?.result ? newAllowance.result >= amount : false;

      return {
        isTokenEnough,
        success: true,
        allowance: newAllowance?.result || 0n,
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [allowance, writeContractAsync, client]
  );

  return { approveAllowance };
};

export const useTokenApprovalWithAddress = (approveAddress: string) => {
  const { allowance, balance, refetch } = useTokenBalanceWithAddress(approveAddress);

  const { writeContractAsync } = useWriteContract();

  const client = usePublicClient();

  const approveAllowance = useCallback(
    async (
      amount: bigint
    ): Promise<{
      success: boolean;
      allowance: bigint;
      isTokenEnough: boolean;
    }> => {
      console.group(`approveAllowance`);
      console.log('user tokenBalance:', balance.toString());
      console.log('need amount:', amount.toString());
      console.log('current allowance:', allowance.toString());
      console.log('need approve', allowance < amount);
      console.log('allowance address:', approveAddress);
      console.groupEnd();

      if (allowance >= amount) {
        return {
          isTokenEnough: true,
          success: true,
          allowance,
        };
      }

      const hash = await writeContractAsync({
        ...erc20Contract,
        functionName: 'approve',
        args: [approveAddress as `0x${string}`, amount],
      });

      console.log(hash);

      const result = await client?.waitForTransactionReceipt({
        hash,
      });

      console.log(result);

      const { data } = await refetch();
      const [newAllowance] = data || [];

      const isTokenEnough = newAllowance?.result ? newAllowance.result >= amount : false;

      return {
        isTokenEnough,
        success: true,
        allowance: newAllowance?.result || 0n,
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [allowance, writeContractAsync, client]
  );

  return { approveAllowance };
};
