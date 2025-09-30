import { atom, useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { useMemo, useEffect, useCallback } from 'react';
import { useReadContract, useReadContracts } from 'wagmi';

import { config } from '@/config';
import { CurrentFeeMode } from '@/types';
import { useSelectedOperators } from '@/stores';
import { isAddressZero, nativeTokenInfo } from '@/utils';
import { erc20Contract, networkContract, clusterNodeContract } from '@/config/contract';

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
  address: '' as `0x${string}`,
  isNativeToken: false,
});

const clusterNodeFeeTokenInfoAtom = atom({
  symbol: '',
  name: '',
  decimals: 18,
  address: '' as `0x${string}`,
  isNativeToken: false,
});

const ownerInfoAtom = atomWithStorage('ownerInfo', {
  owner: '' as `0x${string}`,
  pubkey: '',
});

export const GlobalConfigInit = () => {
  const [, setOperatorFeeWithNetworkFee] = useAtom(operatorFeeWithNetworkFeeAtom);

  const [, setTokenInfo] = useAtom(tokenInfoAtom);

  const [, setClusterNodeFeeTokenInfo] = useAtom(clusterNodeFeeTokenInfoAtom);

  const operatorFeeResult = useReadContract({
    ...networkContract,
    functionName: 'operatorFee',
    args: [true],
  });

  const readFeeTokenAddress = useReadContract({
    ...networkContract,
    functionName: '_token',
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
    query: {
      enabled: !!readFeeTokenAddress.data,
    },
  });

  const readClusterNodeFeeTokenAddress = useReadContract({
    ...clusterNodeContract,
    functionName: '_token',
  });

  // console.log(
  //   '🚀 ~ GlobalConfigInit ~ readClusterNodeFeeTokenAddress:',
  //   readClusterNodeFeeTokenAddress.data,
  //   readFeeTokenAddress.data,
  //   !!readFeeTokenAddress.data
  // );

  const clusterNodeFeeTokenResult = useReadContracts({
    contracts: readClusterNodeFeeTokenAddress.data
      ? [
          {
            abi: erc20Contract.abi,
            address: readClusterNodeFeeTokenAddress.data,
            functionName: 'symbol',
          },
          {
            abi: erc20Contract.abi,
            address: readClusterNodeFeeTokenAddress.data,
            functionName: 'name',
          },
          {
            abi: erc20Contract.abi,
            address: readClusterNodeFeeTokenAddress.data,
            functionName: 'decimals',
          },
        ]
      : [],
    query: {
      enabled: !!readClusterNodeFeeTokenAddress.data,
    },
  });

  useEffect(() => {
    if (operatorFeeResult.data) {
      setOperatorFeeWithNetworkFee(operatorFeeResult.data);
    }
  }, [operatorFeeResult.data, setOperatorFeeWithNetworkFee]);

  useEffect(() => {
    if (readFeeTokenAddress.data && tokenResult.isSuccess && tokenResult.data) {
      if (isAddressZero(readFeeTokenAddress.data)) {
        setTokenInfo({
          ...nativeTokenInfo,
          address: readFeeTokenAddress.data,
        });
        return;
      }

      const [symbol, name, decimals] = tokenResult.data;
      setTokenInfo({
        symbol: symbol.result!,
        name: name.result!,
        decimals: decimals.result!,
        address: readFeeTokenAddress.data,
        isNativeToken: false,
      });
    }
  }, [tokenResult.data, tokenResult.isSuccess, readFeeTokenAddress.data, setTokenInfo]);

  useEffect(() => {
    if (
      readClusterNodeFeeTokenAddress.data &&
      clusterNodeFeeTokenResult.isSuccess &&
      clusterNodeFeeTokenResult.data
    ) {
      if (isAddressZero(readClusterNodeFeeTokenAddress.data)) {
        setClusterNodeFeeTokenInfo({
          ...nativeTokenInfo,
          address: readClusterNodeFeeTokenAddress.data,
        });
        return;
      }

      const [symbol, name, decimals] = clusterNodeFeeTokenResult.data;

      setClusterNodeFeeTokenInfo({
        symbol: symbol?.result!,
        name: name?.result!,
        decimals: decimals?.result!,
        address: readClusterNodeFeeTokenAddress.data,
        isNativeToken: false,
      });
    }
  }, [
    readClusterNodeFeeTokenAddress.data,
    clusterNodeFeeTokenResult.isSuccess,
    clusterNodeFeeTokenResult.data,
    setClusterNodeFeeTokenInfo,
  ]);

  // useEffect(() => {
  //   const handleConnectorUpdate = ({ account, chain }) => {
  //     if (account) {
  //       console.log('new account', account);
  //     } else if (chain) {
  //       console.log('new chain', chain);
  //     }
  //   };

  //   if (activeConnector) {
  //     activeConnector.onAccountsChanged(handleConnectorUpdate);
  //   }

  //   return () => activeConnector?.off('change', handleConnectorUpdate);
  // }, [activeConnector]);

  return null;
};

export const useGlobalConfig = () => {
  const [operatorFeeWithNetworkFee] = useAtom(operatorFeeWithNetworkFeeAtom);
  const [tokenInfo] = useAtom(tokenInfoAtom);
  const [clusterNodeFeeTokenInfo] = useAtom(clusterNodeFeeTokenInfoAtom);
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
    clusterNodeFeeTokenInfo,
  };
};

export const useOwnerInfo = () => {
  const [ownerInfo, setOwnerInfo] = useAtom(ownerInfoAtom);

  const resetOwnerInfo = useCallback(() => {
    setOwnerInfo({
      owner: '' as `0x${string}`,
      pubkey: '',
    });
  }, [setOwnerInfo]);

  return {
    ownerInfo,
    setOwnerInfo,
    resetOwnerInfo,
  };
};
