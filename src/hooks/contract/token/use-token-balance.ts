import { useAccount, useReadContracts } from 'wagmi';

import { config } from '@/config';
import { erc20Contract } from '@/config/contract';

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

// const balanceAtom = atom(0n);

// export const useTokenInfo = () => {
//   const { address } = useAccount();
//   const client = usePublicClient();

//   // if (!address) return { isTokenBalanceLoading: true };

//   // const { data, isLoading: isTokenInfoLoading } = useReadContract({
//   //   contracts: [
//   //     {
//   //       ...erc20Contract,
//   //       functionName: 'balanceOf',
//   //       args: [address!],
//   //     },
//   //     {
//   //       ...erc20Contract,
//   //       functionName: 'name',
//   //     },
//   //   ],
//   // });

//   useEffect(() => {
//     if (!address) return;

//     const fetchData = async () => {
//       const result = await client?.readContract({
//         ...erc20Contract,
//         functionName: 'balanceOf',
//         args: [address!],
//       });

//       // Process the result here
//     };

//     fetchData();
//   }, [address, client]);

//   // if (!address) return { isTokenInfoLoading: true };

//   return {
//     isTokenInfoLoading,
//     symbol: data?.[0].result,
//     balance: data?.[1].result,
//     name: data?.[2].result,
//   };
// };

export const useTokenBalanceWithAddress = (tokenAddress: string) => {
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
        args: [address!, tokenAddress as `0x${string}`],
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
