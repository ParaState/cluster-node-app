import { usePublicClient, useWriteContract } from 'wagmi';

import { networkContract } from '@/config/contract';

import { useGlobalConfig } from '@/components/global-config-init';

export const useValidatorDeposit = () => {
  const { tokenInfo } = useGlobalConfig();
  // const { account } = useAccount();
  const { writeContractAsync } = useWriteContract();

  const client = usePublicClient();

  const depositToken = async (map: any, total: bigint) => {
    console.log('🚀 ~ DvfStore ~ depositEachAmount ~ total:', total.toString());
    const publicKeys = Object.keys(map);
    console.log('🚀 ~ DvfStore ~ depositFromMap ~ publicKeys:', publicKeys);
    const eachList = Object.values(map).map((each) => each);
    console.log('🚀 ~ DvfStore ~ depositFromMap ~ eachList:', eachList);

    const hash = await writeContractAsync({
      ...networkContract,
      functionName: 'deposit',
      args: [publicKeys, eachList, total] as any,
      ...(tokenInfo.isNativeToken ? { value: total } : {}),
    });

    await client?.waitForTransactionReceipt({
      hash,
    });
  };

  return {
    depositToken,
  };
};
