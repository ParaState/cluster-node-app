import { useAccount, usePublicClient, useReadContract } from 'wagmi';

import { registryContract } from '@/config/contract';

export const useIsAccountRegisteredOperator = () => {
  const { address } = useAccount();
  return useReadContract({
    ...registryContract,
    functionName: 'isAccountRegisteredOperator',
    args: [address!],
  });
};

export const useIsAccountRegisteredValidator = () => {
  const { address } = useAccount();
  return useReadContract({
    ...registryContract,
    functionName: 'isAccountRegisteredValidator',
    args: [address!],
  });
};

export const useOperatorInContract = () => {
  const client = usePublicClient();

  const getOperatorInContract = async (id: number) => {
    return client?.readContract({
      ...registryContract,
      functionName: '_operators',
      args: [id],
    });
  };

  return {
    getOperatorInContract,
  };
};
