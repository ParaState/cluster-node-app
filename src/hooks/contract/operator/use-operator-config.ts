import { usePublicClient, useReadContract, useWriteContract } from 'wagmi';

import { operatorConfigContract } from '@/config/contract';

export const useFeeReceiptAddress = (address: string) => {
  const { writeContractAsync } = useWriteContract();

  const getFeeRecipientAddressQuery = useReadContract({
    ...operatorConfigContract,
    functionName: 'getFeeRecipientAddress',
    args: [address as `0x${string}`],
  });

  const client = usePublicClient();

  // const batchSetFeeReceiptAddress = async (pks: string[], address: string) => {
  //   const hash = await writeContractAsync({
  //     ...operatorConfigContract,
  //     functionName: 'batchSetFeeReceiptAddress',
  //     args: [pks as `0x${string}`[], address as `0x${string}`],
  //   });

  //   console.log('🚀 ~ batchSetFeeReceiptAddress ~ hash:', hash);

  //   const result = await client?.waitForTransactionReceipt({
  //     hash,
  //   });

  //   console.log(result);
  // };

  const setFeeRecipientAddress = async (pk: string) => {
    const hash = await writeContractAsync({
      ...operatorConfigContract,
      functionName: 'setFeeRecipientAddress',
      args: [pk as `0x${string}`],
    });

    console.log('🚀 ~ setFeeRecipientAddress ~ hash:', hash);

    const result = await client?.waitForTransactionReceipt({
      hash,
    });

    console.log(result);
  };

  // const getFeeRecipientAddress = async (pk: string) => {
  //   const result = await readContractAsync({
  //     ...operatorConfigContract,
  //     functionName: 'feeRecipientAddress',
  //     args: [pk as `0x${string}`],
  //   });
  // };

  return {
    // batchSetFeeReceiptAddress,
    setFeeRecipientAddress,
    getFeeRecipientAddressQuery,
  };
};
