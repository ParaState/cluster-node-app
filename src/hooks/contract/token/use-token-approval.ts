import { usePublicClient, useWriteContract } from 'wagmi';

import { useTokenBalance, useTokenBalanceWithAddress } from '@/hooks/contract';

import { config } from '@/config';
import { erc20Contract } from '@/config/contract';

export const useTokenApproval = () => {
  const { allowance, balance, refetch } = useTokenBalance();

  const { writeContractAsync } = useWriteContract();

  const client = usePublicClient();

  const approveAllowance = async (
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
  };

  return { approveAllowance };
};

export const useTokenApprovalWithAddress = (tokenAddress: string, spender: string) => {
  const { allowance, balance, symbol, refetch, isLoading } = useTokenBalanceWithAddress(
    tokenAddress,
    spender
  );

  const { writeContractAsync } = useWriteContract();

  const client = usePublicClient();

  const approveToken = async (amount: bigint) => {
    try {
      console.group(`useTokenApprovalWithAddress approveToken ${symbol} ${tokenAddress}`);
      console.log(`user ${symbol} tokenBalance:`, balance.toString());
      console.log('need amount:', amount.toString());
      console.log('current allowance:', allowance.toString());
      console.log('need approve', allowance < amount);
      console.log('token address:', tokenAddress);
      console.log('spender address:', spender);
      console.groupEnd();

      const isBalanceEnough = balance >= amount;

      if (allowance >= amount) {
        return {
          isTokenEnough: true,
          isBalanceEnough,
          success: true,
          allowance,
        };
      }

      const hash = await writeContractAsync({
        abi: erc20Contract.abi,
        address: tokenAddress as `0x${string}`,
        functionName: 'approve',
        args: [spender as `0x${string}`, amount],
      });

      // if (!hash) {
      //   throw new Error('Transaction failed to be sent');
      // }

      // const result = await client?.waitForTransactionReceipt({
      await client?.waitForTransactionReceipt({
        hash,
      });

      // if (!result || result.status === 'reverted') {
      //   throw new Error('Transaction reverted');
      // }

      const { data } = await refetch();
      const [newAllowance] = data || [];

      const isTokenEnough = newAllowance?.result ? newAllowance.result >= amount : false;

      return {
        isTokenEnough,
        isBalanceEnough,
        success: true,
        allowance: newAllowance?.result || 0n,
      };
    } catch (error) {
      console.error('Token approval failed:', error);
      return {
        isTokenEnough: false,
        isBalanceEnough: balance >= amount,
        success: false,
        allowance,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  };

  return { approveToken, isLoading };
};
