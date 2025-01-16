import { useReadContracts } from 'wagmi';

import { registryContract } from '@/config/contract';

export const useValidatorInfo = (pubkeys: any[]) => {
  const { data } = useReadContracts({
    contracts: [
      ...pubkeys.map((pubkey) => ({
        ...registryContract,
        functionName: '_validators',
        args: [pubkey],
      })),
    ],
  });

  return {
    data,
  };
};
