import { useReadContracts } from 'wagmi';

import { networkContract } from '@/config/contract';

export const useOperatorEarning = (address: any) => {
  const { data, isLoading: isEarningLoading } = useReadContracts({
    contracts: [
      { ...networkContract, functionName: 'getOperatorEarningsByOwner', args: [address] },
    ],
  });

  return {
    isEarningLoading,
    operatorEarning: data?.[0].result,
  };
};
