import { useAccount, useBalance, useReadContracts } from 'wagmi';

import { config } from '@/config';
import { erc20Contract } from '@/config/contract';

import { useGlobalConfig } from '@/components/global-config-init';

export const useTokenBalance = () => {
  const { address } = useAccount();

  const {
    data,
    isLoading: isTokenBalanceLoading,
    refetch,
  } = useReadContracts({
    contracts: [
      {
        ...erc20Contract,
        functionName: 'allowance',
        args: [address!, config.contractAddress.network],
      },

      {
        ...erc20Contract,
        functionName: 'balanceOf',
        args: [address!],
      },
    ],
  });

  const [allowance, balance] = data || [];

  return {
    isTokenBalanceLoading,
    balance: balance?.result || 0n,
    allowance: allowance?.result || 0n,
    refetch,
  };
};

export const useTokenBalanceForAddress = (address: any) => {
  const { tokenInfo } = useGlobalConfig();

  const {
    data,
    isLoading: isTokenBalanceLoading,
    refetch,
  } = useReadContracts({
    contracts: [
      {
        ...erc20Contract,
        address: tokenInfo.address,
        functionName: 'allowance',
        args: [address!, config.contractAddress.network],
      },
      {
        ...erc20Contract,
        address: tokenInfo.address,
        functionName: 'balanceOf',
        args: [address!],
      },
    ],
    query: {
      enabled: tokenInfo.address && address && !tokenInfo.isNativeToken,
    },
  });

  const [allowance, balance] = data || [];
  // console.log("🚀 ~ useTokenBalanceForAddress ~ data:", data)

  const { data: nativeBalance, isLoading: isNativeBalanceLoading } = useBalance({
    address: address as `0x${string}`,
    query: {
      enabled: tokenInfo.isNativeToken,
    },
  });
  // console.log('🚀 ~ useTokenBalanceForAddress ~ nativeBalance:', nativeBalance);

  return {
    isTokenBalanceLoading: tokenInfo.isNativeToken ? isNativeBalanceLoading : isTokenBalanceLoading,
    balance: tokenInfo.isNativeToken ? nativeBalance?.value || 0n : balance?.result || 0n,
    allowance: allowance?.result || 0n,
    refetch,
  };
};

export const useTokenBalanceWithAddress = (tokenAddress: string, spender: string) => {
  const { address } = useAccount();

  const { data, isLoading, refetch } = useReadContracts({
    contracts: [
      {
        ...erc20Contract,
        address: tokenAddress as `0x${string}`,
        functionName: 'allowance',
        args: [address!, spender as `0x${string}`],
      },
      {
        ...erc20Contract,
        address: tokenAddress as `0x${string}`,
        functionName: 'balanceOf',
        args: [address!],
      },
      {
        ...erc20Contract,
        address: tokenAddress as `0x${string}`,
        functionName: 'symbol',
      },
    ],
    query: {
      enabled: !!tokenAddress && !!address && !!spender,
    },
  });

  const [allowance, balance, symbol] = data || [];
  // console.log('🚀 ~ useTokenBalanceWithAddress ~ symbol:', balance, symbol);

  return {
    isLoading,
    balance: balance?.result || 0n,
    allowance: allowance?.result || 0n,
    symbol: symbol?.result || '',
    refetch,
  };
};
