import { atom, useAtom } from 'jotai';
import { useMemo, useEffect, useCallback } from 'react';
import { useReadContract, useAccountEffect, useReadContracts } from 'wagmi';

import { config } from '@/config';
import { CurrentFeeMode } from '@/types';
import { useSelectedOperators } from '@/stores';
import { erc20Contract, networkContract } from '@/config/contract';

const operatorFeeWithNetworkFeeAtom = atom(0n);

const initialSubscriptionFeeMap = {
  [CurrentFeeMode.minimum]: BigInt(0),
  [CurrentFeeMode.month]: BigInt(0),
  [CurrentFeeMode.year]: BigInt(0),
};

const tokenInfoAtom = atom({
  symbol: '',
  name: '',
  decimals: 18,
});

export const GlobalConfigInit = () => {
  const [, setOperatorFeeWithNetworkFee] = useAtom(operatorFeeWithNetworkFeeAtom);

  const [, setTokenInfo] = useAtom(tokenInfoAtom);

  const operatorFeeResult = useReadContract({
    ...networkContract,
    functionName: 'operatorFee',
    args: [true],
    query: {
      refetchInterval: 3_000,
      // enabled: false,
      // staleTime: 1_000,
    },
  });

  const tokenResult = useReadContracts({
    contracts: [
      {
        ...erc20Contract,
        functionName: 'symbol',
      },
      {
        ...erc20Contract,
        functionName: 'name',
      },
      {
        ...erc20Contract,
        functionName: 'decimals',
      },
    ],
  });

  useEffect(() => {
    console.log('🚀GlobalConfigInit:', operatorFeeResult.data);
    if (operatorFeeResult.data) {
      setOperatorFeeWithNetworkFee(operatorFeeResult.data);
    }
  }, [operatorFeeResult.data, setOperatorFeeWithNetworkFee]);

  useEffect(() => {
    if (tokenResult.isSuccess && tokenResult.data) {
      const [symbol, name, decimals] = tokenResult.data;
      setTokenInfo({ symbol: symbol.result!, name: name.result!, decimals: decimals.result! });
    }
  }, [tokenResult.data]);

  useAccountEffect({
    onConnect(data) {
      // console.log('🚀 ~ onConnect ~ data:', data);
    },
    onDisconnect() {},
  });

  return null;
};

export const useGlobalConfig = () => {
  const [operatorFeeWithNetworkFee] = useAtom(operatorFeeWithNetworkFeeAtom);
  const [tokenInfo] = useAtom(tokenInfoAtom);
  const { currentCommitteeSize } = useSelectedOperators();

  const subscriptionFeeFeeByBlocks = useCallback(
    (operatorCount: number, blocks: number): bigint => {
      // (operator fee + network fee) * (operator list length, default is 4) * blocks
      const result = operatorFeeWithNetworkFee * BigInt(operatorCount) * BigInt(blocks);
      return result;
    },
    [operatorFeeWithNetworkFee]
  );

  const subscriptionFeeMap = useMemo(() => {
    if (operatorFeeWithNetworkFee) {
      return {
        [CurrentFeeMode.minimum]: subscriptionFeeFeeByBlocks(
          currentCommitteeSize.sharesNumber,
          config.minimumBlocksValidatorShouldPay
        ),
        [CurrentFeeMode.month]: subscriptionFeeFeeByBlocks(
          currentCommitteeSize.sharesNumber,
          config.GLOBAL_VARIABLE.BLOCKS_PER_MONTH
        ),
        [CurrentFeeMode.year]: subscriptionFeeFeeByBlocks(
          currentCommitteeSize.sharesNumber,
          config.GLOBAL_VARIABLE.BLOCKS_PER_YEAR
        ),
      };
    }
    return initialSubscriptionFeeMap;
  }, [currentCommitteeSize.sharesNumber, operatorFeeWithNetworkFee, subscriptionFeeFeeByBlocks]);

  const getSubscriptionFeeFeeByBlocks = useCallback(
    (blocks: number) => {
      return subscriptionFeeFeeByBlocks(currentCommitteeSize.sharesNumber, blocks);
    },
    [currentCommitteeSize.sharesNumber, subscriptionFeeFeeByBlocks]
  );

  const getSubscriptionFeeFeeByFeeMode = useCallback(
    (feeMode: CurrentFeeMode, validatCount: number = 1) => {
      return subscriptionFeeMap[feeMode] * BigInt(validatCount);
    },
    [subscriptionFeeMap]
  );

  return {
    operatorFeeWithNetworkFee,
    getSubscriptionFeeFeeByFeeMode,
    getSubscriptionFeeFeeByBlocks,
    tokenInfo,
  };
};
